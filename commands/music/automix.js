// src/commands/music/automix.js
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("automix").setDescription("Toggle AutoMix");

export async function execute(interaction, client) {
  const newState = client.autoMixEngine.toggle(interaction.guild.id);
  return interaction.reply({ content: `AutoMix ${newState ? "enabled" : "disabled"}.` });
}
