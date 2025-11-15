// src/modules/panelHandler.js
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export async function createOrUpdatePanel(client, player) {
  const channel = client.channels.cache.get(player.textChannel);
  if (!channel) return;

  const track = player.queue.current;
  const embed = new EmbedBuilder()
    .setColor("#00FFFF")
    .setTitle("🎛 Auralia — DJ Control Panel")
    .setDescription(track ? `[${track.title}](${track.uri})` : "No track playing")
    .addFields(
      { name: "Queue", value: `${player.queue.size} track(s)`, inline: true },
      { name: "AutoMix", value: `${client.autoMixEngine.enabled(player.guild) ? "ON" : "OFF"}`, inline: true }
    )
    .setThumbnail(track?.thumbnail ?? null);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("pause_toggle").setEmoji("⏯").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("skip").setEmoji("⏭").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("automixtoggle").setLabel("AutoMix").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("lyrics").setEmoji("🎤").setStyle(ButtonStyle.Secondary)
  );

  if (player.panelMessage) {
    try {
      const msg = await channel.messages.fetch(player.panelMessage);
      return await msg.edit({ embeds: [embed], components: [row] });
    } catch (e) {
      // message not found or deleted — send again
      const msg = await channel.send({ embeds: [embed], components: [row] });
      player.panelMessage = msg.id;
      return msg;
    }
  } else {
    const msg = await channel.send({ embeds: [embed], components: [row] });
    player.panelMessage = msg.id;
    return msg;
  }
}
