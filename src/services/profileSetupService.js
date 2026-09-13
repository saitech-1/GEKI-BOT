const profileSessions = new Map();

export function createProfileSession(userId) {

    profileSessions.set(userId, {
        country: null,
        branch: null,
        dojo: null,
        grade: null,
        weightClass: null,
        yearsTraining: null,
        bio: null
    });
}

export function getProfileSession(userId) {

    return profileSessions.get(userId);
}

export function updateProfileSession(userId, field, value) {

    const session = profileSessions.get(userId);

    if (!session) {
        return null;
    }

    session[field] = value;

    return session;
}

export function deleteProfileSession(userId) {

    profileSessions.delete(userId);
}