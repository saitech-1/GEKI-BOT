import "dotenv/config";
import { REST, Routes } from "discord.js";
import { data as pingData } from "./src/commands/ping.js";
import { data as aboutData } from "./src/commands/about.js";
import { data as helloData } from "./src/commands/hello.js"
import { data as profileData} from "./src/commands/profile.js"
import { data as profileSetupData} from "./src/commands/profile-setup.js"
import {data as xpData} from "./src/commands/add-xp.js"
import { data as leaderboardData} from "./src/commands/leaderboard.js"
const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN);

try {
    console.log("🔄 Registering..");

    await rest.put(
        Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            process.env.GUILD_ID
        ),
        {
            body: [ pingData.toJSON(), aboutData.toJSON(), helloData.toJSON(), profileData.toJSON(), profileSetupData.toJSON(), xpData.toJSON(), leaderboardData.toJSON() ]
        }
    );

    console.log("✅registered!");
} catch (error) {
    console.error(error);
}