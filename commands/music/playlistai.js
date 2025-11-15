// src/commands/music/playlistai.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import OpenAI from "openai";
import config from "../../config.js";
const clientAI = new OpenAI({ apiKey: config.OPENAI_API_KEY });

export const data = new SlashCommandBuilder()
  .setName("playlistai")
  .setDescription("Generate a playlist by mood")
  .addStringOption(o => o.setName("mood").setRequired(true).setDescription("e.g., chill, party"));

export async function execute(interaction) {
  await interaction.deferReply();
  const mood = interaction.options.getString("mood");

  try {
    const prompt = `Make a 10-song playlist for mood: ${mood}. Reply with numbered lines: Artist - Title.`;
    const resp = await clientAI.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });
    const text = resp.choices?.[0]?.message?.content ?? "No response";
    const embed = new EmbedBuilder()
      .setTitle(`AI Playlist — ${mood}`)
      .setDescription(text)
      .setColor("#00FFFF");
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    console.error("playlistai error", e);
    await interaction.editReply("AI playlist generation failed.");
  }
}
