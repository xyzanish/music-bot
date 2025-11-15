// src/modules/voiceTalkback.js
import googleTTS from "google-tts-api";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice";

export async function speakToUser(client, member, message) {
  try {
    const vc = member.voice.channel;
    if (!vc) return;
    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator
    });

    const url = googleTTS.getAudioUrl(message, {
      lang: "en",
      slow: false,
      host: "https://translate.google.com"
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(url);
    connection.subscribe(player);
    player.play(resource);

    // auto disconnect after speaking
    player.on("stateChange", (oldState, newState) => {
      if (newState.status === "idle") connection.destroy();
    });
  } catch (e) {
    console.error("TTS error", e);
  }
}
