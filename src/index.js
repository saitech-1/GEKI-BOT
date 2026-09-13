import "dotenv/config";

import {
    Client,
    Collection,
    GatewayIntentBits
} from "discord.js";

import fs from "node:fs";
import path from "node:path";
import http from "node:http";

import {
    fileURLToPath,
    pathToFileURL
} from "node:url";


/* =========================
   PATH SETUP
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* =========================
   RENDER HEALTH SERVER
========================= */

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("🥋 GEKI BOT ONLINE");
});

server.listen(PORT, () => {

    console.log(
        `🌐 Health server running on port ${PORT}`
    );

});


/* =========================
   CREATE CLIENT
========================= */

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});


/* =========================
   COMMAND COLLECTION
========================= */

client.commands = new Collection();


/* =========================
   LOAD COMMANDS
========================= */

const commandsPath = path.join(
    __dirname,
    "commands"
);

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));


for (const file of commandFiles) {

    const filePath = path.join(
        commandsPath,
        file
    );

    const command = await import(
        pathToFileURL(filePath).href
    );

    client.commands.set(
        command.data.name,
        command
    );

    console.log(
        `📦 Loaded command: /${command.data.name}`
    );
}


/* =========================
   LOAD EVENTS
========================= */

const eventsPath = path.join(
    __dirname,
    "events"
);

const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));


for (const file of eventFiles) {

    const filePath = path.join(
        eventsPath,
        file
    );

    const event = await import(
        pathToFileURL(filePath).href
    );

    if (event.once) {

        client.once(
            event.name,
            (...args) => event.execute(client, ...args)
        );

    } else {

        client.on(
            event.name,
            (...args) => event.execute(client, ...args)
        );
    }

    console.log(
        `⚡ Loaded event: ${event.name}`
    );
}

/* =========================
   ERROR HANDLING
========================= */

client.on("error", (error) => {
    console.error("❌ Discord client error:", error);
});

client.on("shardError", (error) => {
    console.error("❌ Discord shard error:", error);
});

process.on("unhandledRejection", (error) => {
    console.error("❌ Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught exception:", error);
});


/* =========================
   DISCORD LOGIN
========================= */

client.login(process.env.DISCORD_TOKEN);