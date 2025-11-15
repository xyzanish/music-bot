// src/events/ready.js
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Discord.js emits the built-in 'ready' event when the client is ready.
// Use the standard name so our handler is called at the correct time.
// discord.js v14 uses the `clientReady` event alias — use it to avoid deprecation warnings
export const name = "clientReady";
export const once = true;

export async function execute(client) {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Register global slash commands
  const commands = [];
  const commandsPath = path.join(__dirname, "..", "commands");
  
  try {
    console.log(`📂 Loading commands from: ${commandsPath}`);
    const items = fs.readdirSync(commandsPath);
    console.log(`📂 Found ${items.length} items in commands directory`);
    
    for (const item of items) {
      const itemPath = path.join(commandsPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        const files = fs.readdirSync(itemPath).filter(f => f.endsWith(".js"));
        console.log(`📁 Loading ${files.length} files from subdirectory: ${item}`);
        for (const file of files) {
          const filePath = path.join(itemPath, file);
          const fileUrl = new URL(`file://${filePath}`).href;
          const mod = await import(fileUrl);
          if (mod.data) {
            commands.push(mod.data.toJSON());
            console.log(`✓ Loaded command: ${mod.data.name}`);
          }
        }
      } else if (item.endsWith(".js")) {
        const fileUrl = new URL(`file://${itemPath}`).href;
        const mod = await import(fileUrl);
        if (mod.data) {
          commands.push(mod.data.toJSON());
          console.log(`✓ Loaded command: ${mod.data.name}`);
        }
      }
    }

    console.log(`📦 Total commands loaded: ${commands.length}`);
    const rest = new REST({ version: "10" }).setToken(config.TOKEN);
    
    // Register globally
    await rest.put(Routes.applicationCommands(config.CLIENT_ID), { body: commands });
    console.log(`🔧 Slash commands registered globally (${commands.length} commands).`);
    
    // Also register to first guild for immediate testing (if bot is in a guild)
    const guild = client.guilds.cache.first();
    if (guild) {
      await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, guild.id), { body: commands });
      console.log(`✅ Commands also registered to guild: ${guild.name}`);
    }
  } catch (e) {
    console.error("Register commands error", e);
  }
}
