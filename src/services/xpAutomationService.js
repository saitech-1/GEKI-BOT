import { addXP } from "./xpService.js";

const messageCooldowns = new Map();

const MESSAGE_XP = 5;
const MESSAGE_COOLDOWN = 60 * 1000;

export async function handleMessageXP(message) {

    if (!message.guild) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    const userId = message.author.id;

    const now = Date.now();

    const lastXP =
        messageCooldowns.get(userId);

    if (
        lastXP &&
        now - lastXP < MESSAGE_COOLDOWN
    ) {
        return;
    }

    messageCooldowns.set(userId, now);

    try {

        const result = await addXP(
            message.author,
            MESSAGE_XP,
            "Discord message activity"
        );

        if (result.level.leveledUp) {

            await message.channel.send(
                `🎉 **LEVEL UP!** ${message.author} reached **Level ${result.level.new}**!`
            );

        }

    } catch (error) {

        console.error(
            "❌ Automatic XP failed:",
            error
        );

    }
}