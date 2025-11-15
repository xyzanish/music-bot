// src/commands/music/lyrics.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import axios from "axios";
import config from "../../config.js";

export const data = new SlashCommandBuilder()
  .setName("lyrics")
  .setDescription("Get lyrics for a song")
  .addStringOption(o => o.setName("song").setDescription("Song name (optional)").setRequired(false));

export async function execute(interaction, client) {
  await interaction.deferReply();
  const song = interaction.options.getString("song");
  let query = song;
  const player = client.player?.players.get(interaction.guild.id);
  if (!query && player?.queue?.current) query = player.queue.current.title;
  if (!query) return interaction.editReply("❌ No song provided and nothing playing.");

  try {
    const res = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${config.GENIUS_TOKEN}` }
    });
    const hit = res.data.response.hits[0];
    if (!hit) return interaction.editReply("No lyrics found.");
    const songData = hit.result;
    const embed = new EmbedBuilder()
      .setTitle(songData.full_title)
      .setURL(songData.url)
      .setDescription("Click the title to view full lyrics on Genius.")
      .setThumbnail(songData.song_art_image_thumbnail_url);
    return interaction.editReply({ embeds: [embed] });
  } catch (e) {
    console.error("lyrics error", e);
    return interaction.editReply("Lyrics fetch error.");
  }
}
