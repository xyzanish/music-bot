// src/commands/music/skip.js
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip the current track");

export async function execute(interaction, client) {
  const player = client.player?.players.get(interaction.guild.id);
  if (!player) return interaction.reply({ content: "❌ No player active.", ephemeral: true });
  try {
    player.skip();
    return interaction.reply("⏭️ Skipped current track.");
  } catch (e) {
    return interaction.reply({ content: "❌ Could not skip track.", ephemeral: true });
  }
}
