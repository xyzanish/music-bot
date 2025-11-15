// src/commands/music/resume.js
import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("resume").setDescription("Resume playback");
export async function execute(interaction, client) {
  const player = client.player?.players.get(interaction.guild.id);
  if (!player) return interaction.reply({ content: "❌ No player active.", ephemeral: true });
  try {
    player.pause(false);
    return interaction.reply("▶️ Resumed.");
  } catch (e) {
    return interaction.reply({ content: "❌ Could not resume.", ephemeral: true });
  }
}
