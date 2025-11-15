// src/commands/about.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import pkg from "../package.json" with { type: "json" };
import os from "os";

export const data = new SlashCommandBuilder().setName("about").setDescription("Bot information");

export async function execute(interaction, client) {
  const uptime = Math.floor(client.uptime / 1000);
  const embed = new EmbedBuilder()
    .setTitle("Auralia — AI Music DJ")
    .setDescription("An advanced Discord music bot with AutoMix, voice control, and filters.")
    .addFields(
      { name: "Developer", value: "Anish", inline: true },
      { name: "Library", value: "discord.js v14 + Erela.js (Lavalink)", inline: true },
      { name: "Uptime (s)", value: `${uptime}`, inline: true },
      { name: "Version", value: pkg.version ?? "1.0.0", inline: true },
      { name: "Hostname", value: os.hostname(), inline: true }
    )
    .setColor("#5865F2");
  await interaction.reply({ embeds: [embed] });
}
