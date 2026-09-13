import {
    updateProfileSession,
    getProfileSession,
    deleteProfileSession,
} from "../services/profileSetupService.js";
import {     saveFighterProfile } from "../services/profileService.js"

import {
    createProfileEmbed,
    createProfileComponents
} from "../commands/profile-setup.js";

import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";

export const name = "interactionCreate";
export const once = false;

export async function execute(client, interaction) {

    if (!interaction) {
        console.log("❌ Interaction is undefined");
        return;
    }

    /*
    ==================================================
    SLASH COMMANDS
    ==================================================
    */

    if (interaction.isChatInputCommand()) {

        const command =
            client.commands.get(interaction.commandName);

        if (!command) return;

        try {

            await command.execute(interaction);

        } catch (error) {

            console.error(error);

            if (interaction.replied || interaction.deferred) {

                await interaction.followUp({
                    content: "❌ Something went wrong.",
                    flags: 64
                });

            } else {

                await interaction.reply({
                    content: "❌ Something went wrong.",
                    flags: 64
                });
            }
        }

        return;
    }


    /*
    ==================================================
    PROFILE SELECT MENUS
    ==================================================
    */

    if (interaction.isStringSelectMenu()) {

        const userId = interaction.user.id;

        const session =
            getProfileSession(userId);

        if (!session) {

            await interaction.reply({
                content: "❌ Your profile session has expired. Please run `/profile-setup` again.",
                flags: 64
            });

            return;
        }


        const fieldMap = {

            profile_country: "country",

            profile_branch: "branch",

            profile_grade: "grade",

            profile_weight: "weightClass"

        };


        const field =
            fieldMap[interaction.customId];

        if (!field) return;


        const value =
            interaction.values[0];


        updateProfileSession(
            userId,
            field,
            value
        );


        console.log(
            `✅ ${field} saved: ${value}`
        );


        const updatedSession =
            getProfileSession(userId);


        await interaction.update({

            embeds: [
                createProfileEmbed(
                    updatedSession
                )
            ],

            components:
                createProfileComponents(
                    updatedSession
                )
        });


        return;
    }


    /*
    ==================================================
    NEXT BUTTON
    ==================================================
    */

    if (
        interaction.isButton() &&
        interaction.customId === "profile_next"
    ) {

        const userId =
            interaction.user.id;

        const session =
            getProfileSession(userId);


        if (!session) {

            await interaction.reply({

                content:
                    "❌ Your profile session has expired. Please run `/profile-setup` again.",

                flags: 64

            });

            return;
        }


        /*
        ------------------------------------------
        VALIDATE STEP 1
        ------------------------------------------
        */

        if (
            !session.country ||
            !session.branch ||
            !session.grade ||
            !session.weightClass
        ) {

            await interaction.reply({

                content:
                    "⚠️ Please complete all Step 1 fields before continuing.",

                flags: 64

            });

            return;
        }


        /*
        ------------------------------------------
        OPEN STEP 2 MODAL
        ------------------------------------------
        */

        const modal =
            new ModalBuilder()
                .setCustomId("profile_step2_modal")
                .setTitle("🥋 GEKI Fighter Profile");


        const yearsTraining =
            new TextInputBuilder()

                .setCustomId(
                    "profile_years_training"
                )

                .setLabel(
                    "Years of Kyokushin Training"
                )

                .setPlaceholder(
                    "Example: 5"
                )

                .setStyle(
                    TextInputStyle.Short
                )

                .setRequired(true)

                .setMaxLength(2);


        const bio =
            new TextInputBuilder()

                .setCustomId(
                    "profile_bio"
                )

                .setLabel(
                    "Tell us about yourself"
                )

                .setPlaceholder(
                    "Your experience, achievements, goals..."
                )

                .setStyle(
                    TextInputStyle.Paragraph
                )

                .setRequired(false)

                .setMaxLength(500);


        modal.addComponents(

            new ActionRowBuilder()
                .addComponents(
                    yearsTraining
                ),

            new ActionRowBuilder()
                .addComponents(
                    bio
                )

        );


        await interaction.showModal(
            modal
        );

        return;
    }


    /*
    ==================================================
    STEP 2 MODAL SUBMIT
    ==================================================
    */

    if (
        interaction.isModalSubmit() &&
        interaction.customId === "profile_step2_modal"
    ) {

        const userId =
            interaction.user.id;


        const session =
            getProfileSession(userId);


        if (!session) {

            await interaction.reply({

                content:
                    "❌ Your profile session has expired. Please run `/profile-setup` again.",

                flags: 64

            });

            return;
        }


        /*
        ------------------------------------------
        GET MODAL VALUES
        ------------------------------------------
        */

        const yearsTraining =
            interaction.fields.getTextInputValue(
                "profile_years_training"
            );


        const bio =
            interaction.fields.getTextInputValue(
                "profile_bio"
            );


        /*
        ------------------------------------------
        VALIDATE YEARS
        ------------------------------------------
        */

        const years =
            Number(yearsTraining);


        if (
            !Number.isInteger(years) ||
            years < 0 ||
            years > 50
        ) {

            await interaction.reply({

                content:
                    "❌ Years of training must be a number between 0 and 50.",

                flags: 64

            });

            return;
        }


        /*
        ------------------------------------------
        SAVE TO TEMP SESSION
        ------------------------------------------
        */

        updateProfileSession(
            userId,
            "yearsTraining",
            years
        );


        updateProfileSession(
            userId,
            "bio",
            bio || null
        );


        const updatedSession =
            getProfileSession(userId);


        /*
        ------------------------------------------
        STEP 2 PREVIEW
        ------------------------------------------
        */

        const embed =
            createProfileEmbed(
                updatedSession
            );


        embed
            .setDescription(
                "Review your fighter profile before saving it to GEKI."
            )
            .setFooter({
                text: "Step 2 of 2 • Ready to save"
            });


        const backButton =
            new ButtonBuilder()

                .setCustomId(
                    "profile_back"
                )

                .setLabel(
                    "BACK"
                )

                .setEmoji(
                    "⬅️"
                )

                .setStyle(
                    ButtonStyle.Secondary
                );


        const saveButton =
            new ButtonBuilder()

                .setCustomId(
                    "profile_save"
                )

                .setLabel(
                    "SAVE PROFILE"
                )

                .setEmoji(
                    "💾"
                )

                .setStyle(
                    ButtonStyle.Success
                );


        const buttonRow =
            new ActionRowBuilder()
                .addComponents(
                    backButton,
                    saveButton
                );


        await interaction.reply({

            embeds: [
                embed
            ],

            components: [
                buttonRow
            ]

        });


        return;
    }


    /*
    ==================================================
    BACK BUTTON
    ==================================================
    */

    if (
        interaction.isButton() &&
        interaction.customId === "profile_back"
    ) {

        const userId =
            interaction.user.id;


        const session =
            getProfileSession(userId);


        if (!session) {

            await interaction.reply({

                content:
                    "❌ Your profile session has expired. Please run `/profile-setup` again.",

                flags: 64

            });

            return;
        }


        await interaction.update({

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


        return;
    }


    /*
    ==================================================
    SAVE PROFILE
    ==================================================
    */

    if (
    interaction.isButton() && interaction.customId === "profile_save") {

        const userId =
            interaction.user.id;


        const session =
            getProfileSession(userId);


        /*
        ==========================================
        CHECK SESSION
        ==========================================
        */

        if (!session) {

            await interaction.reply({

                content:
                    "❌ Your profile session has expired. Please run `/profile-setup` again.",

                flags: 64

            });

            return;
        }


        /*
        ==========================================
        VALIDATE PROFILE
        ==========================================
        */

        if (
            !session.country ||
            !session.branch ||
            !session.grade ||
            !session.weightClass ||
            session.yearsTraining === null
        ) {

            await interaction.reply({

                content:
                    "❌ Your profile is incomplete. Please go back and complete all required fields.",

                flags: 64

            });

            return;
        }


        /*
        ==========================================
        SHOW LOADING STATE
        ==========================================
        */

        await interaction.update({

            content:
                "💾 **Saving your GEKI fighter profile...**",

            embeds: [],

            components: []

        });


        try {

            /*
            ======================================
            SAVE TO DATABASE
            ======================================
            */

            await saveFighterProfile(

                interaction.user.id,

                interaction.user.username,

                session

            );


            /*
            ======================================
            DELETE TEMP SESSION
            ======================================
            */

            deleteProfileSession(
                userId
            );


            /*
            ======================================
            SUCCESS UI
            ======================================
            */

            await interaction.editReply({

                content:
                    "🥋 **PROFILE CREATED SUCCESSFULLY!**\n\n" +

                    "Your GEKI fighter profile has been saved.\n\n" +

                    "Use `/profile` anytime to view your profile.\n\n" +

                    "🔥 **OSU! Keep training.**"

            });


            console.log(
                `✅ Profile saved for ${interaction.user.username}`
            );


        } catch (error) {

            console.error(
                "❌ Failed to save fighter profile:",
                error
            );


            await interaction.editReply({

                content:
                    "❌ **Failed to save your profile.**\n\n" +

                    "Something went wrong while connecting to the database. " +

                    "Your information has not been lost from this session."

            });

        }


        return;
    }

}