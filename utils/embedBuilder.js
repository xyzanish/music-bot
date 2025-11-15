import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function createNowPlayingEmbed(track, user, color = "#1DB954") {
  const embed = new EmbedBuilder()
    .setTitle("🎵 Now Playing")
    .setDescription(`**[${track.title || "Unknown"}](${track.url || ""})**`)
    .setColor(color)
    .addFields(
      { name: "👤 Artist", value: track.author || "Unknown", inline: true },
      { name: "⏱️ Duration", value: formatDuration(track.duration || 0), inline: true },
      { name: "📊 Source", value: track.source || "Unknown", inline: true }
    )
    .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL() })
    .setTimestamp();
  
  if (track.thumbnail) {
    embed.setThumbnail(track.thumbnail);
  }
  
  return embed;
}

export function createQueueEmbed(tracks, page = 1, pageSize = 10, color = "#1DB954") {
  const totalPages = Math.ceil(tracks.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageTracks = tracks.slice(start, end);

  const embed = new EmbedBuilder()
    .setTitle("🎶 Queue")
    .setColor(color)
    .setFooter({ text: `Page ${page} of ${totalPages} (${tracks.length} songs)` });

  if (pageTracks.length === 0) {
    embed.setDescription("Queue is empty");
  } else {
    const description = pageTracks
      .map((track, i) => `${start + i + 1}. **${track.title}** - ${track.author}`)
      .join("\n");
    embed.setDescription(description);
  }

  return embed;
}

export function createControlButtons(hasSkip = true, hasLyrics = true) {
  const controlButtons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("pause_toggle")
        .setLabel("⏸️")
        .setStyle(ButtonStyle.Primary),
      hasSkip ? new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("⏭️")
        .setStyle(ButtonStyle.Primary) : null,
      hasLyrics ? new ButtonBuilder()
        .setCustomId("lyrics")
        .setLabel("📝")
        .setStyle(ButtonStyle.Secondary) : null
    )
    .setComponents(controlButtons.components.filter(c => c !== null));

  return controlButtons;
}

export function formatDuration(ms) {
  if (!ms || ms <= 0) return "Live";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  }
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}
