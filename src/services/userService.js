import { db } from "../prisma/db.ts";

const User = db.orm.public.User;
const FighterProfile = db.orm.public.FighterProfile;

export async function getOrCreateUser(discordId, username) {

    const existingUser =
        await User
            .where({ discordId })
            .first();

    if (existingUser) {
        return existingUser;
    }

    const user =
        await User.create({
            discordId,
            username,
            xp: 0,
            level: 1,
        });

    await FighterProfile.create({
        userId: user.id,
    });

    console.log(
        `🆕 GEKI user created: ${username}`
    );

    return user;
}