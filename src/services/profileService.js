import { db } from "../prisma/db.ts";

export async function saveFighterProfile(
    discordId,
    username,
    profile
) {

    /*
    ==========================================
    FIND USER
    ==========================================
    */

    let user = await db.orm.public.User
        .where({ discordId })
        .first();


    /*
    ==========================================
    CREATE USER IF NEEDED
    ==========================================
    */

    if (!user) {

        user = await db.orm.public.User.create({
            discordId,
            username
        });

    }


    /*
    ==========================================
    CHECK EXISTING FIGHTER PROFILE
    ==========================================
    */

    const existingProfile =
        await db.orm.public.FighterProfile
            .where({
                userId: user.id
            })
            .first();


    /*
    ==========================================
    CREATE PROFILE
    ==========================================
    */

    if (!existingProfile) {

        const fighterProfile =
            await db.orm.public.FighterProfile.create({

                userId: user.id,

                country: profile.country,

                branch: profile.branch,

                dojo: profile.dojo,

                grade: profile.grade,

                weightClass: profile.weightClass,

                yearsTraining: profile.yearsTraining,

                bio: profile.bio

            });

        return fighterProfile;
    }


    /*
    ==========================================
    UPDATE PROFILE
    ==========================================
    */

    const updatedProfile =
        await db.orm.public.FighterProfile
            .where({
                userId: user.id
            })
            .update({

                country: profile.country,

                branch: profile.branch,

                dojo: profile.dojo,

                grade: profile.grade,

                weightClass: profile.weightClass,

                yearsTraining: profile.yearsTraining,

                bio: profile.bio

            });


    return updatedProfile;
}