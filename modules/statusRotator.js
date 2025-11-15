// src/modules/statusRotator.js
import { ActivityType } from "discord.js";
import config from "../config.js";

export function startStatusRotator(client) {
  const statuses = [
    () => `${client.guilds.cache.size} servers`,
    () => `Type /play to start`,
    () => `AutoMix ready`
  ];

  let idx = 0;
  client.user.setPresence({
    activities: [{ name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching }],
    status: "online"
  });

  setInterval(() => {
    const s = statuses[idx % statuses.length]();
    client.user.setPresence({ activities: [{ name: s, type: ActivityType.Watching }], status: "online" });
    idx++;
  }, config.STATUS_ROTATE_INTERVAL);
}
