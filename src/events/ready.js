import { syncGuildMembers } from "../services/memberSyncService.js";

export const name = "clientReady";
export const once = true;

export async function execute(client) {

    console.log(`🥋 ${client.user.tag} is online!`);

    for (const guild of client.guilds.cache.values()) {

        console.log(`🔄 Syncing members in ${guild.name}...`);

        try {

            await syncGuildMembers(guild);

        } catch (error) {

            console.error(
                `❌ Failed to sync ${guild.name}:`,
                error
            );

        }
    }
}