// src/events/interactionCreate.js
import { ChannelType } from "discord.js";
import config from "../config.js";

export const name = "interactionCreate";
export const once = false;

export async function execute(interaction, client) {
  try {
    // Handle chat input commands (slash commands)
    if (interaction.isChatInputCommand()) {
      // Guard: ensure the client has a 'commands' collection (helps avoid TypeError)
      if (!client || !client.commands) {
        console.error("interactionCreate: client.commands is undefined", {
          client: !!client,
          commands: client?.commands
        });
        return await interaction.reply({
          content: "❌ Bot commands are not loaded yet. Please try again shortly.",
          flags: 64
        }).catch(e => console.error("Reply error (commands not ready):", e));
      }

      const cmdModule = client.commands.get?.(interaction.commandName);
      if (!cmdModule) {
        return await interaction.reply({ 
          content: "❌ Command not found.",
          flags: 64 // Ephemeral flag
        }).catch(e => console.error("Reply error:", e));
      }

      try {
        await cmdModule.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        
        // Only reply if not already replied or deferred
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: "❌ An error occurred while executing the command.",
            flags: 64
          }).catch(e => console.error("Error reply failed:", e));
        } else if (interaction.deferred && !interaction.replied) {
          await interaction.editReply({ 
            content: "❌ An error occurred while executing the command." 
          }).catch(e => console.error("Edit reply failed:", e));
        }
      }
      return;
    }

    // Handle button interactions
    if (interaction.isButton()) {
      const id = interaction.customId;
      const player = client.player?.players.get(interaction.guild.id);
      
      try {
        if (id === "pause_toggle") {
          if (!player) {
            return await interaction.reply({ 
              content: "❌ No active player.", 
              flags: 64
            }).catch(e => console.error("Error:", e));
          }
          player.pause(!player.paused);
          await interaction.deferUpdate().catch(e => console.error("Defer update error:", e));
        } 
        else if (id === "skip") {
          if (!player) {
            return await interaction.reply({ 
              content: "❌ No active player.", 
              flags: 64
            }).catch(e => console.error("Error:", e));
          }
          player.skip();
          await interaction.deferUpdate().catch(e => console.error("Defer update error:", e));
        } 
        else if (id === "automixtoggle") {
          await interaction.reply({ 
            content: "⚠️ AutoMix feature disabled", 
            flags: 64
          }).catch(e => console.error("Error:", e));
        }
        else {
          await interaction.deferUpdate().catch(e => console.error("Defer update error:", e));
        }
      } catch (e) {
        console.error("Button interaction error:", e);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: "❌ Button action failed.", 
            flags: 64
          }).catch(e => console.error("Error:", e));
        }
      }
    }
  } catch (e) {
    console.error("interactionCreate error:", e);
  }
}
