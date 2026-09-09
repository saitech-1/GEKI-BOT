import "dotenv/config";

import {
    Client,
    Collection,
    GatewayIntentBits
} from "discord.js";

import fs from "node:fs";
import path from "node:path";

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
   LOGIN
========================= */

client.login(
    process.env.DISCORD_TOKEN
);