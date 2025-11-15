// src/commands/music/play.js
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play song/link or search")
  .addStringOption(o => o.setName("query").setDescription("Song name or link").setRequired(true));

export async function execute(interaction, client) {
  try {
    // Defer immediately - must be done within 3 seconds of interaction
    await interaction.deferReply();

    const query = interaction.options.getString("query");
    const member = interaction.member;
    const channel = member.voice.channel;
    
    if (!channel) {
      return await interaction.editReply("❌ You must be in a voice channel to play music.");
    }

    // Show searching embed
    const searchingEmbed = new EmbedBuilder()
      .setTitle("🔍 Searching...")
      .setDescription(`**Searching for:** \`${query}\`\n\n*Finding the best match...*`)
      .setColor("#1DB954") // Spotify green
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [searchingEmbed] });

    // Search for track using discord-player
    const results = await client.player.search(query, {
      requestedBy: interaction.user,
      searchEngine: "youtube"
    }).catch(e => {
      console.error("Search error:", e);
      return null;
    });

    if (!results || results.tracks.length === 0) {
      return await interaction.editReply("❌ No tracks found for your search.");
    }

    const track = results.tracks[0];
    
    // Join voice channel
    try {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    } catch (e) {
      console.error("Voice join error:", e);
    }

    // Get or create player for this guild
    let player = client.player.players.get(interaction.guild.id);
    if (!player) {
      player = client.player.create({
        guild: interaction.guild,
        textChannel: interaction.channel,
        voiceChannel: channel,
        volume: 100,
        selfDeafen: true
      });
    }

    // Add track to queue and play
    await player.play(track).catch(e => console.error("Play error:", e));

    // Create now playing embed
    const nowPlayingEmbed = new EmbedBuilder()
      .setTitle("🎵 Now Playing")
      .setDescription(`**${track.title}**\n*by ${track.author}*`)
      .setColor("#1DB954") // Spotify green
      .setThumbnail(track.thumbnail || "")
      .addFields(
        { name: "Duration", value: `\`${formatDuration(track.duration)}\``, inline: true },
        { name: "Channel", value: channel.name, inline: true },
        { name: "Volume", value: "100%", inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    // Add control buttons
    const controlButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("pause_toggle")
          .setLabel("⏸️ Pause")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("skip")
          .setLabel("⏭️ Skip")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("lyrics")
          .setLabel("📝 Lyrics")
          .setStyle(ButtonStyle.Secondary)
      );
    
    await interaction.editReply({ 
      embeds: [nowPlayingEmbed],
      components: [controlButtons]
    });
  } catch (error) {
    console.error("Play command error:", error);
    // Try to reply with error, handling both deferred and non-deferred states
    try {
      if (interaction.deferred) {
        await interaction.editReply("❌ An error occurred while playing music.");
      } else {
        await interaction.reply("❌ An error occurred while playing music.");
      }
    } catch (replyError) {
      console.error("Failed to reply with error:", replyError);
    }
  }
}

function formatDuration(ms) {
  if (!ms) return "0:00";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
