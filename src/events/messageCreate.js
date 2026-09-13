import { addXP } from "../services/xpService.js";

const MESSAGE_XP = 10;
const MESSAGE_COOLDOWN = 60 * 1000;

// Stores the last time each user earned message XP
const cooldowns = new Map();

export const name = "messageCreate";
export const once = false;

export async function execute(client, message) {

    /*
    ==========================================
    IGNORE BOTS
    ==========================================
    */

    if (message.author.bot) {
        return;
    }


    /*
    ==========================================
    IGNORE DMs
    ==========================================
    */

    if (!message.guild) {
        return;
    }


    /*
    ==========================================
    XP COOLDOWN
    ==========================================
    */

    const userId = message.author.id;
    const now = Date.now();

    const lastEarned =
        cooldowns.get(userId);

    if (
        lastEarned &&
        now - lastEarned < MESSAGE_COOLDOWN
    ) {
        return;
    }


    /*
    ==========================================
    RECORD XP TIME
    ==========================================
    */

    cooldowns.set(userId, now);


    try {

        const result = await addXP(
            message.author,
            MESSAGE_XP,
            "Message activity"
        );


        /*
        ======================================
        LEVEL UP
        ======================================
        */

        if (result.level.leveledUp) {

            await message.channel.send(
                `🎉 **LEVEL UP!**\n\n` +
                `${message.author} reached **Level ${result.level.new}**!\n` +
                `⭐ Total XP: **${result.xp.new}**`
            );

        }


        /*
        ======================================
        LOG XP
        ======================================
        */

        console.log(
            `⭐ ${message.author.username} +${MESSAGE_XP} XP | ` +
            `Total: ${result.xp.new} | ` +
            `Level: ${result.level.new}`
        );


    } catch (error) {

        console.error(
            "❌ XP system error:",
            error
        );

    }

}