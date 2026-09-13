import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";

import { db } from "../prisma/db.ts";


/*
==========================================
DATABASE
==========================================
*/

const User = db.orm.public.User;


/*
==========================================
COMMAND
==========================================
*/

export const data = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the top GEKI fighters by XP.");


/*
==========================================
EXECUTE
==========================================
*/

export async function execute(interaction) {

    try {

        /*
        ======================================
        GET TOP 10 USERS
        ======================================
        */

        const users =
            await User
                .orderBy((u) => u.xp.desc())
                .limit(10)
                .all();


        /*
        ======================================
        CHECK EMPTY
        ======================================
        */

        if (
            !users ||
            users.length === 0
        ) {

            await interaction.reply({

                content:
                    "🏆 The GEKI leaderboard is empty.",

                flags: 64

            });

            return;

        }


        /*
        ======================================
        MEDALS
        ======================================
        */

        const medals = [
            "🥇",
            "🥈",
            "🥉"
        ];


        /*
        ======================================
        BUILD LEADERBOARD
        ======================================
        */

        const leaderboard =
            users
                .map((user, index) => {

                    const position =
                        medals[index] ??
                        `**${index + 1}.**`;


                    return [
                        `${position} **${user.username}**`,
                        `> 🔥 Level ${user.level} • ⭐ ${user.xp} XP`
                    ].join("\n");

                })
                .join("\n\n");


        /*
        ======================================
        CREATE EMBED
        ======================================
        */

        const embed =
            new EmbedBuilder()

                .setTitle(
                    "🏆 GEKI LEADERBOARD"
                )

                .setDescription(
                    leaderboard
                )

                .setFooter({
                    text:
                        "GEKI Fighter Progression System"
                })

                .setTimestamp();


        /*
        ======================================
        SEND
        ======================================
        */

        await interaction.reply({

            embeds: [
                embed
            ]

        });


    } catch (error) {

        /*
        ======================================
        ERROR HANDLING
        ======================================
        */

        console.error(
            "❌ Failed to load leaderboard:",
            error
        );


        if (
            interaction.replied ||
            interaction.deferred
        ) {

            await interaction.followUp({

                content:
                    "❌ Failed to load the GEKI leaderboard.",

                flags: 64

            });

        } else {

            await interaction.reply({

                content:
                    "❌ Failed to load the GEKI leaderboard.",

                flags: 64

            });

        }

    }

}