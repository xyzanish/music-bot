// src/commands/music/effects.js
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("effects")
  .setDescription("Apply audio effects (bass, nightcore, clear)")
  .addStringOption(o => o.setName("type").setDescription("Effect type").setRequired(true).addChoices(
    { name: "bass", value: "bass" },
    { name: "nightcore", value: "nightcore" },
    { name: "clear", value: "clear" }
  ));

export async function execute(interaction, client) {
  const type = interaction.options.getString("type");
  const player = client.player?.players.get(interaction.guild.id);
  if (!player) return interaction.reply({ content: "❌ No active player.", ephemeral: true });

  try {
    if (type === "bass") {
      await player.setEQ([
        { band: 0, gain: 0.6 },
        { band: 1, gain: 0.67 },
        { band: 2, gain: 0.67 }
      ]);
      return interaction.reply("🎚 Bassboost applied.");
    } else if (type === "nightcore") {
      await player.setTimescale({ speed: 1.25, pitch: 1.1, rate: 1 });
      return interaction.reply("🌙 Nightcore effect applied.");
    } else {
      await player.clearFilters();
      return interaction.reply("🔄 Effects cleared.");
    }
  } catch (e) {
    return interaction.reply({ content: "❌ Could not apply effect.", ephemeral: true });
  }
}
