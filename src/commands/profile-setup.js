import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";

import {
    createProfileSession
} from "../services/profileSetupService.js";


// ==========================================
// COMMAND
// ==========================================

export const data = new SlashCommandBuilder()
    .setName("profile-setup")
    .setDescription("Create or edit your GEKI fighter profile");


// ==========================================
// PROFILE EMBED
// ==========================================

export function createProfileEmbed(session) {

    return new EmbedBuilder()

        .setTitle("🥋 GEKI FIGHTER PROFILE")

        .setDescription(
            "Build your GEKI fighter profile.\n\n" +
            "Select your information from the menus below.\n" +
            "You can review everything before saving."
        )

        .addFields(

            {
                name: "🌎 Country",
                value: session.country ?? "Not selected",
                inline: true
            },

            {
                name: "🏯 Branch",
                value: session.branch ?? "Not selected",
                inline: true
            },

            {
                name: "🎖️ Grade",
                value: session.grade ?? "Not selected",
                inline: true
            },

            {
                name: "⚖️ Weight Class",
                value: session.weightClass ?? "Not selected",
                inline: true
            }

        )

        .setFooter({
            text: "Step 1 of 2 • GEKI Community"
        });
}


// ==========================================
// PROFILE COMPONENTS
// ==========================================

export function createProfileComponents(session) {


    // ======================================
    // COUNTRY
    // ======================================

    const countryMenu =
        new StringSelectMenuBuilder()

            .setCustomId("profile_country")

            .setPlaceholder(
                "🌎 Select your country"
            )

            .addOptions(

                {
                    label: "Myanmar",
                    value: "Myanmar",
                    description:
                        "Kyokushin practitioners from Myanmar",
                    default:
                        session.country === "Myanmar"
                },

                {
                    label: "Japan",
                    value: "Japan",
                    description:
                        "Kyokushin practitioners from Japan",
                    default:
                        session.country === "Japan"
                },

                {
                    label: "Russia",
                    value: "Russia",
                    description:
                        "Kyokushin practitioners from Russia",
                    default:
                        session.country === "Russia"
                },

                {
                    label: "Poland",
                    value: "Poland",
                    description:
                        "Kyokushin practitioners from Poland",
                    default:
                        session.country === "Poland"
                },

                {
                    label: "Armenia",
                    value: "Armenia",
                    description:
                        "Kyokushin practitioners from Armenia",
                    default:
                        session.country === "Armenia"
                }

            );


    // ======================================
    // BRANCH
    // ======================================

    const branchMenu =
        new StringSelectMenuBuilder()

            .setCustomId("profile_branch")

            .setPlaceholder(
                "🏯 Select your branch"
            )

            .addOptions(

                {
                    label: "Kougeki",
                    value: "Kougeki",
                    default:
                        session.branch === "Kougeki"
                },

                {
                    label: "Shingi",
                    value: "Shingi",
                    default:
                        session.branch === "Shingi"
                },

                {
                    label: "Regular",
                    value: "Regular",
                    default:
                        session.branch === "Regular"
                },

                {
                    label: "Thein Pyu",
                    value: "theinPyu",
                    default:
                        session.branch === "theinPyu"
                },

                {
                    label: "Lanmadaw",
                    value: "Lanmadaw",
                    default:
                        session.branch === "Lanmadaw"
                },

                {
                    label: "8 Miles",
                    value: "8 Miles",
                    default:
                        session.branch === "8 Miles"
                },

                {
                    label: "South Okkala",
                    value: "southOkkala",
                    default:
                        session.branch === "southOkkala"
                },

                {
                    label: "Other",
                    value: "Other",
                    default:
                        session.branch === "Other"
                }

            );


    // ======================================
    // GRADE
    // ======================================

    const gradeMenu =
        new StringSelectMenuBuilder()

            .setCustomId("profile_grade")

            .setPlaceholder(
                "🎖️ Select your grade"
            )

            .addOptions(

                {
                    label: "Beginner",
                    value: "Beginner",
                    default:
                        session.grade === "Beginner"
                },

                {
                    label: "Kyu",
                    value: "Kyu",
                    default:
                        session.grade === "Kyu"
                },

                {
                    label: "1st Dan",
                    value: "1st Dan",
                    default:
                        session.grade === "1st Dan"
                },

                {
                    label: "2nd Dan",
                    value: "2nd Dan",
                    default:
                        session.grade === "2nd Dan"
                },

                {
                    label: "3rd Dan",
                    value: "3rd Dan",
                    default:
                        session.grade === "3rd Dan"
                },

                {
                    label: "4th Dan",
                    value: "4th Dan",
                    default:
                        session.grade === "4th Dan"
                },

                {
                    label: "5th Dan+",
                    value: "5th Dan+",
                    default:
                        session.grade === "5th Dan+"
                }

            );


    // ======================================
    // WEIGHT CLASS
    // ======================================

    const weightMenu =
        new StringSelectMenuBuilder()

            .setCustomId("profile_weight")

            .setPlaceholder(
                "⚖️ Select your weight class"
            )

            .addOptions(

                {
                    label: "-60 kg",
                    value: "-60",
                    default:
                        session.weightClass === "-60"
                },

                {
                    label: "-70 kg",
                    value: "-70",
                    default:
                        session.weightClass === "-70"
                },

                {
                    label: "-80 kg",
                    value: "-80",
                    default:
                        session.weightClass === "-80"
                },

                {
                    label: "+80 kg",
                    value: "+80",
                    default:
                        session.weightClass === "+80"
                },

                {
                    label: "Youth Division",
                    value: "youth_division",
                    default:
                        session.weightClass === "youth_division"
                }

            );


    // ======================================
    // NEXT BUTTON
    // ======================================

    const nextButton =
        new ButtonBuilder()

            .setCustomId(
                "profile_next"
            )

            .setLabel("NEXT")

            .setEmoji("➡️")

            .setStyle(
                ButtonStyle.Primary
            );


    // ======================================
    // ACTION ROWS
    // ======================================

    const countryRow =
        new ActionRowBuilder()
            .addComponents(
                countryMenu
            );


    const branchRow =
        new ActionRowBuilder()
            .addComponents(
                branchMenu
            );


    const gradeRow =
        new ActionRowBuilder()
            .addComponents(
                gradeMenu
            );


    const weightRow =
        new ActionRowBuilder()
            .addComponents(
                weightMenu
            );


    const buttonRow =
        new ActionRowBuilder()
            .addComponents(
                nextButton
            );


    return [

        countryRow,

        branchRow,

        gradeRow,

        weightRow,

        buttonRow

    ];
}


// ==========================================
// COMMAND EXECUTION
// ==========================================

export async function execute(interaction) {


    // ======================================
    // CREATE USER SESSION
    // ======================================

    createProfileSession(
        interaction.user.id
    );


    // ======================================
    // GET USER SESSION
    // ======================================

    const session = {
        country: null,
        branch: null,
        dojo: null,
        grade: null,
        weightClass: null,
        yearsTraining: null,
        bio: null
    };


    // ======================================
    // SEND PROFILE GUI
    // ======================================

    await interaction.reply({

        embeds: [

            createProfileEmbed(
                session
            )

        ],

        components:

            createProfileComponents(
                session
            )

    });

}
