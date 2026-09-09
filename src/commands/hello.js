import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("hello").setDescription("Greeting");
 
export async function execute(interaction) {
    await interaction.reply(`Hello ${interaction.user.username}! Welcome to GEKI Community!`);
}