import { getOrCreateUser } from "./userService.js";

export async function syncGuildMembers(guild) {

    console.log("🔄 Fetching guild members...");

    await guild.members.fetch();

    console.log(
        `👥 Found ${guild.members.cache.size} members.`
    );

    let synced = 0;

    for (const member of guild.members.cache.values()) {

        if (member.user.bot) {
            continue;
        }

        console.log(
            `🔄 Syncing: ${member.user.username}`
        );

        await getOrCreateUser(
            member.id,
            member.user.username
        );

        synced++;

        console.log(
            `✅ Synced: ${member.user.username}`
        );
    }

    console.log(`🎉 Finished! Synced ${synced} members.`);
}