// src/commands/music/pause.js
import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder().setName("pause").setDescription("Pause playback");
export async function execute(interaction, client) {
  const player = client.player?.players.get(interaction.guild.id);
  if (!player) return interaction.reply({ content: "❌ No player active.", ephemeral: true });
  try {
    player.pause(true);
    return interaction.reply("⏸️ Paused.");
  } catch (e) {
    return interaction.reply({ content: "❌ Could not pause.", ephemeral: true });
  }
}
