// src/voice/voiceCommands.js
import { speakToUser } from "../modules/voiceTalkback.js";

export async function handleVoiceCommand(text, client, guild, member) {
  const lower = text.toLowerCase();
  const player = client.manager.players.get(guild.id);
  const name = member.displayName || member.user.username;

  if (lower.includes("pause")) {
    player?.pause(true);
    await speakToUser(client, member, `Okay ${name}, music paused.`);
    return true;
  }
  if (lower.includes("resume") || lower.includes("play")) {
    player?.pause(false);
    await speakToUser(client, member, `Resuming music for you, ${name}.`);
    return true;
  }
  if (lower.includes("skip") || lower.includes("next")) {
    player?.stop();
    await speakToUser(client, member, `Skipped the track, ${name}.`);
    return true;
  }
  if (lower.includes("stop")) {
    player?.destroy();
    await speakToUser(client, member, `Playback stopped, ${name}.`);
    return true;
  }
  if (lower.includes("bass")) {
    player?.setEQ([{ band: 0, gain: 0.6 }]);
    await speakToUser(client, member, `Bass boost enabled, ${name}.`);
    return true;
  }

  await speakToUser(client, member, `Sorry ${name}, I didn't understand that.`);
  return false;
}
