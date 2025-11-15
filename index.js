// src/index.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client, Collection, GatewayIntentBits, Partials, ActivityType } from "discord.js";
import mongoose from "mongoose";
import { Player } from "discord-player";
import config from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.cooldowns = new Collection();

// Initialize music player
client.player = new Player(client);

// Load commands
const commandsPath = path.join(__dirname, "commands");
for (const item of fs.readdirSync(commandsPath)) {
  const itemPath = path.join(commandsPath, item);
  const stat = fs.statSync(itemPath);
  
  if (stat.isDirectory()) {
    // Load commands from subdirectory
    for (const file of fs.readdirSync(itemPath).filter(f => f.endsWith(".js"))) {
      const filePath = path.join(itemPath, file);
      const fileUrl = new URL(`file://${filePath}`).href;
      const command = await import(fileUrl);
      if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
      }
    }
  } else if (item.endsWith(".js")) {
    // Load direct command files
    const fileUrl = new URL(`file://${itemPath}`).href;
    const command = await import(fileUrl);
    if (command.data && command.data.name) {
      client.commands.set(command.data.name, command);
    }
  }
}

// Log loaded commands count for debugging
try {
  console.log(`🧭 client.commands loaded: ${client.commands?.size ?? 0} commands`);
} catch (e) {
  console.error("Error logging commands count:", e);
}

// Load events
const eventsPath = path.join(__dirname, "events");
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"))) {
  const filePath = path.join(eventsPath, file);
  const fileUrl = new URL(`file://${filePath}`).href;
  const evt = await import(fileUrl);
  if (evt.once) client.once(evt.name, (...args) => evt.execute(...args, client));
  else client.on(evt.name, (...args) => evt.execute(...args, client));
}

// MongoDB connection (disabled for now - configure in config.js with valid URI)
if (config.MONGO_URI && config.MONGO_URI.startsWith("mongodb")) {
  mongoose.connect(config.MONGO_URI, { })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(e => console.error("❌ MongoDB error", e));
} else {
  console.log("⚠️  MongoDB not configured");
}

// Attach AutoMix engine instance
// import AutoMixEngine from "./modules/AutoMixEngine.js";
// client.autoMixEngine = new AutoMixEngine(client);

// Start dynamic status rotator
import { startStatusRotator } from "./modules/statusRotator.js";
// Start the status rotator once the client is ready
// Use the `clientReady` event to match discord.js v14's event alias
client.once("clientReady", () => startStatusRotator(client));

// Login
client.login(config.TOKEN);

// Export for modules that need client reference (optional)
export default client;


