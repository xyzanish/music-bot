// src/config.example.js
export default {
  TOKEN: "YOUR_DISCORD_BOT_TOKEN",
  CLIENT_ID: "YOUR_APPLICATION_CLIENT_ID",
  MONGO_URI: "mongodb+srv://user:pass@cluster.mongodb.net/auralia",
  LAVALINK: {
    host: "127.0.0.1",
    port: 2333,
    password: "youshallnotpass",
    secure: false,
    identifier: "MAIN_NODE"
  },
  GENIUS_TOKEN: "YOUR_GENIUS_API_TOKEN",
  OPENAI_API_KEY: "YOUR_OPENAI_KEY",
  DJ_ROLE_IDS: ["123456789012345678"], // array of allowed role IDs for voice control
  PREFIX_FOR_STATUS: "/", // used in dynamic status, easy to edit
  STATUS_ROTATE_INTERVAL: 20000 // ms
};
