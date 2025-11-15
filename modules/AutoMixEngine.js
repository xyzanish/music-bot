// src/modules/AutoMixEngine.js
import { getRecommendation } from "../utils/autoMix.js";

export default class AutoMixEngine {
  constructor(client) {
    this.client = client;
    this.guildStates = new Map(); // store enabled flags per guild
    this.bind();
  }

  bind() {
    // Listen to erela trackEnd and trackStart via manager events
    this.client.manager.on("trackEnd", async (player, track, payload) => {
      try {
        if (this.guildStates.get(player.guild)) {
          const rec = await getRecommendation(track.title);
          if (rec) {
            await player.queue.add(rec);
            if (!player.playing && !player.paused) player.play();
          }
        }
      } catch (e) {
        console.error("AutoMix trackEnd error:", e);
      }
    });
  }

  toggle(guildId) {
    const cur = !!this.guildStates.get(guildId);
    this.guildStates.set(guildId, !cur);
    return !cur;
  }

  enabled(guildId) {
    return !!this.guildStates.get(guildId);
  }
}
