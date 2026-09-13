import { SlashCommandBuilder } from "discord.js";
import { db } from "../prisma/db.ts";

export const data = new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your GEKI fighter profile");

export async function execute(interaction) {

    const discordId = interaction.user.id;

    try {

        // Find the GEKI user and load their fighter profile
        const user = await db.orm.public.User
            .include("fighterProfile")
            .where({ discordId })
            .first();

        // User does not exist in database
        if (!user) {
            await interaction.reply(
                "❌ You don't have a GEKI profile yet."
            );
            return;
        }

        const profile = user.fighterProfile;

        await interaction.reply(
            `🥋 **GEKI FIGHTER PROFILE**

👤 **Username:** ${user.username}
🆔 **Discord ID:** ${user.discordId}

🌎 **Country:** ${profile?.country ?? "Not set"}
🏯 **Branch:** ${profile?.branch ?? "Not set"}
🎖️ **Grade:** ${profile?.grade ?? "Not set"}
⚖️ **Weight Class:** ${profile?.weightClass ?? "Not set"}
⏱️ **Training:** ${profile?.yearsTraining ?? "Not set"} years

📝 **Bio:** ${profile?.bio ?? "Not set"}

🔥 **GEKI Level:** ${user.level}
⭐ **XP:** ${user.xp}

${profile?.verified ? "🟢 **Profile verified**" : "⚪ **Profile not verified**"}

**OSU!**`
        );

    } catch (error) {

        console.error("❌ Failed to load profile:", error);

        await interaction.reply(
            "❌ Something went wrong while loading your profile."
        );
    }
}