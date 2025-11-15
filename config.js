// src/config.example.js
import dotenv from "dotenv";
dotenv.config();

export default {
  TOKEN: process.env.DISCORD_TOKEN || "YOUR_DISCORD_BOT_TOKEN_HERE",
  CLIENT_ID: process.env.CLIENT_ID || "YOUR_CLIENT_ID_HERE",
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://username:password@cluster.mongodb.net/dbname",
  LAVALINK: {
    host: "lavalink_v3.muzykant.xyz",
    port: 443,
    password: "https://discord.gg/v6sdrD9kPh",
    secure: true,
    identifier: "Muzykant lavalink v3"
  },
  GENIUS_TOKEN: process.env.GENIUS_TOKEN || "YOUR_GENIUS_TOKEN_HERE",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY_HERE",
  DJ_ROLE_IDS: [], // array of allowed role IDs for voice control
  PREFIX_FOR_STATUS: "/", // used in dynamic status, easy to edit
  STATUS_ROTATE_INTERVAL: 20000 // ms
};
