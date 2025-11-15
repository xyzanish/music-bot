// src/voice/VoiceReceiverStarter.js
import { getVoiceConnection, VoiceReceiver } from "@discordjs/voice";
import { transcribeUserStream } from "../modules/VoiceRecognition.js";
import { hasVoiceControlRole } from "../utils/roleCheck.js";
import { handleVoiceCommand } from "./voiceCommands.js";

export function attachReceiver(connection, client) {
  const receiver = connection.receiver;
  // Note: @discordjs/voice API changed across versions; this is a conceptual skeleton.
  connection.receiver.speaking.on("start", async (userId) => {
    const member = connection.joinConfig.guild.members.cache.get(userId);
    if (!member || !hasVoiceControlRole(member)) return;

    const opusStream = connection.receiver.subscribe(userId, { end: { behavior: 'silence', duration: 1000 } });
    try {
      const text = await transcribeUserStream(opusStream);
      if (text) {
        await handleVoiceCommand(text, client, connection.joinConfig.guild, member);
      }
    } catch (e) {
      console.error("transcribe error", e);
    }
  });
}
