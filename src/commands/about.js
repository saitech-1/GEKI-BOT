import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("about").setDescription("Learn about GEKI Bot");
 
export async function execute(interaction) {
    await interaction.reply(
        `🥋 **GEKI BOT**

Kyokushin Community Bot
Version: 0.1.0

Built for the GEKI community.
OSU!`
    );
}