export const name = "guildMemberAdd";
export const once = false;

export async function execute(client, member) {

    console.log(
        `👋 New member joined: ${member.user.tag}`
    );

    const channel = member.guild.channels.cache.find(
        channel => channel.name === "welcome"
    );

    if (!channel) {
        console.log("❌ Welcome channel not found.");
        return;
    }

    await channel.send(
        `🥋 **OSU! Welcome to GEKI Community, ${member}!**

Welcome to the international Kyokushin community!

Train hard. Stay humble. Keep fighting.

🔥 OSU!`
    );
}