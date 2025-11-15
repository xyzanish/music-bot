// src/commands/setrole.js
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

// In-memory role storage for simplicity (replace with real DB in production)
const voiceRoles = new Map();

export const data = new SlashCommandBuilder()
  .setName("setrole")
  .setDescription("Set the role allowed to use voice commands")
  .addRoleOption(o => o.setName("role").setDescription("Role").setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const role = interaction.options.getRole("role");
  voiceRoles.set(interaction.guild.id, role.id);
  return interaction.reply(`✅ Voice command role set to **${role.name}**`);
}
