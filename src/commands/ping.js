import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("ping").setDescription("Check if GEKI Bot is alive");
 
export async function execute(interaction) {
    await interaction.reply(`Osu!! ${interaction.user.username}. Anything I can help?`);
}