import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} from "discord.js";

import { addXP } from "../services/xpService.js";

export const data = new SlashCommandBuilder()
    .setName("add-xp")
    .setDescription("Add XP to a GEKI fighter.")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("The fighter receiving XP.")
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName("amount")
            .setDescription("Amount of XP to add.")
            .setRequired(true)
            .setMinValue(1)
    )
    .addStringOption(option =>
        option
            .setName("reason")
            .setDescription("Why is XP being awarded?")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(
        PermissionFlagsBits.ManageGuild
    );

export async function execute(interaction) {

    const targetUser =
        interaction.options.getUser("user");

    const amount =
        interaction.options.getInteger("amount");

    const reason =
        interaction.options.getString("reason");


    try {

        const result =
            await addXP(
                targetUser,
                amount,
                reason
            );


        const embed =
            new EmbedBuilder()
                .setTitle("🥋 GEKI XP AWARDED")
                .setDescription(
                    `**${targetUser.username}** received **+${amount} XP**.`
                )
                .addFields(
                    {
                        name: "⭐ XP",
                        value:
                            `${result.xp.old} → **${result.xp.new}**`,
                        inline: true
                    },
                    {
                        name: "🔥 Level",
                        value:
                            `${result.level.old} → **${result.level.new}**`,
                        inline: true
                    },
                    {
                        name: "📝 Reason",
                        value: reason,
                        inline: false
                    }
                );

        if (result.level.leveledUp) {

            embed.addFields({
                name: "🎉 LEVEL UP!",
                value:
                    `**${targetUser.username}** reached **Level ${result.level.new}**!`
            });

        }


        await interaction.reply({
            embeds: [embed]
        });


    } catch (error) {

        console.error(
            "❌ Failed to add XP:",
            error
        );

        await interaction.reply({
            content:
                "❌ Failed to add XP. Please try again.",
            ephemeral: true
        });

    }

}