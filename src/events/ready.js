export const name = "clientReady";
export const once = true;

export async function execute(client) {
    console.log(
        `🥋 GEKI BOT ONLINE AS ${client.user.tag}`
    );
}