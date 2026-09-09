import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your GEKI fighter profile");

export async function execute(interaction) {

    const username = interaction.user.username;
    const userId = interaction.user.id;

    await interaction.reply(
        `🥋 **GEKI FIGHTER PROFILE**

👤 **Username:** ${username}
🆔 **Discord ID:** ${userId}

🌎 **Country:** Not set
🏯 **Dojo:** Not set
🎖️ **Grade:** Not set
⚖️ **Weight Class:** Not set

🔥 **GEKI Level:** 1
⭐ **XP:** 0

OSU!`
    );
}