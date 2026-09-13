export const name = "guildMemberAdd";
export const once = false;
import { getOrCreateUser } from '../services/userService.js';

export async function execute(client, member) {

    console.log(
        `👋 New member joined: ${member.user.tag}`
    );

    try {
        // Create or find the GEKI user
        const user = await getOrCreateUser(
            member.id,
            member.user.username
        );

        console.log(
            `✅ GEKI user ready: ${user.username} (ID: ${user.id})`
        );

    } catch (error) {
        console.error(
            "❌ Failed to create GEKI user:",
            error
        );

        return;
    }

    const channel = member.guild.channels.cache.find(
        channel => channel.name === "arrival"
    );

    if (!channel) {
        console.log("❌ Welcome channel not found.");
        return;
    }

    await channel.send(
        `🥋 **OSU! Welcome to GEKI Community, ${member}!**

Welcome to the GEKI community!

Train hard. Stay humble. Keep fighting.
Please introduce yourself in #introduce-urself

🔥 OSU!`
    );
}