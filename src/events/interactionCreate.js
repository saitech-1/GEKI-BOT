export const name = "interactionCreate";
export const once = false;

export async function execute(client, interaction) {

    if (!interaction) {
        console.log("❌ Interaction is undefined");
        return;
    }

    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command = client.commands.get(
        interaction.commandName
    );

    if (!command) {
        return;
    }

    try {

        await command.execute(interaction);

    } catch (error) {

        console.error(error);

        if (interaction.replied || interaction.deferred) {

            await interaction.followUp(
                "❌ Something went wrong."
            );

        } else {

            await interaction.reply(
                "❌ Something went wrong."
            );
        }
    }
}