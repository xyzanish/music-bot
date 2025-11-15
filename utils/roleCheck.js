// src/utils/roleCheck.js
import config from "../config.js";
export function hasVoiceControlRole(member) {
  if (!member) return false;
  for (const id of config.DJ_ROLE_IDS) {
    if (member.roles.cache.has(id)) return true;
  }
  return false;
}
