import { db } from "../prisma/db.ts";
import { getOrCreateUser } from "./userService.js";


/*
==========================================
CALCULATE LEVEL
==========================================
*/

export function calculateLevel(xp) {

    return Math.floor(
        Math.sqrt(xp / 100)
    ) + 1;

}


/*
==========================================
ADD XP
==========================================
*/

export async function addXP(
    discordUser,
    amount,
    reason
) {

    // Validation

    if (!discordUser?.id) {
        throw new Error(
            "Invalid Discord user."
        );
    }

    if (
        !Number.isInteger(amount) ||
        amount <= 0
    ) {
        throw new Error(
            "XP amount must be a positive integer."
        );
    }

    if (
        !reason ||
        typeof reason !== "string"
    ) {
        throw new Error(
            "XP reason is required."
        );
    }


    // Find or create user

    const user =
        await getOrCreateUser(
            discordUser.id,
            discordUser.username
        );


    // Old values

    const oldXP = user.xp;
    const oldLevel = user.level;


    // Calculate new values

    const newXP =
        oldXP + amount;

    const newLevel =
        calculateLevel(newXP);


    // Update user

    const updatedUser =
        await db.orm.public.User
            .where({
                id: user.id
            })
            .update({
                xp: newXP,
                level: newLevel,
                username: discordUser.username
            });


    // Record XP history

    await db.orm.public.XPTransaction.create({

        userId: user.id,

        amount: amount,

        reason: reason

    });


    // Level-up detection

    const leveledUp =
        newLevel > oldLevel;


    return {

        user: updatedUser,

        xp: {
            old: oldXP,
            gained: amount,
            new: newXP
        },

        level: {
            old: oldLevel,
            new: newLevel,
            leveledUp
        }

    };

}