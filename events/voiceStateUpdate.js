// src/events/voiceStateUpdate.js
import { joinVoiceChannel, EndBehaviorType, getVoiceConnection } from "@discordjs/voice";
import { transcribeUserStream } from "../modules/VoiceRecognition.js";
import { hasVoiceControlRole } from "../utils/roleCheck.js";
import { handleVoiceCommand } from "../voice/voiceCommands.js";
import db from "../utils/db.js";

export const name = "voiceStateUpdate";
export const once = false;

export async function execute(oldState, newState, client) {
  try {
    // Only when user starts speaking or joins
    if (!oldState.channelId && newState.channelId) {
      const member = newState.member;
      if (!hasVoiceControlRole(member)) return;

      const connection = joinVoiceChannel({
        channelId: newState.channelId,
        guildId: newState.guild.id,
        adapterCreator: newState.guild.voiceAdapterCreator
      });

      // keep connection but not auto-leaving here; listening is handled elsewhere when user speaks
    }

    // Optional: handle when member leaves, cleanup
  } catch (e) {
    console.error("voiceStateUpdate error", e);
  }
}
