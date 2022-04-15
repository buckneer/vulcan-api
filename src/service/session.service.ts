import Session, {SessionDocument} from "../model/session.model";
import {UserDocument} from "../model/user.model";
import {LeanDocument, FilterQuery, UpdateQuery} from "mongoose";
import "dotenv/config"
import {get} from "lodash";
import {findUser} from "./user.service";
import {decode, sign} from "../utils/jwt.utils";

export async function createSession(userId: string, userAgent: string) {
    const session = await Session.create({user: userId, userAgent})


    return session.toJSON();
}


export default function createAccessToken({user, session} : {
    user:
        | Omit<UserDocument, "password">
        | LeanDocument<Omit<UserDocument, "password">>;
    session: Omit<SessionDocument, "password"> | LeanDocument<Omit<SessionDocument, "password">>;
}) {
    return sign(
        {...user, session: session._id},
        {expiresIn: process.env.ACCESS_TOKEN_TTL}
    );
}


export async function reIssueAccessToken({
                                             refreshToken,
                                         }: {
    refreshToken: string;
}) {
    // Decode the refresh token
    const { decoded } = decode(refreshToken);

    if (!decoded || !get(decoded, "_id")) return false;

    // Get the session
    const session = await Session.findById(get(decoded, "_id"));

    // Make sure the session is still valid
    if (!session || !session?.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = createAccessToken({ user, session });

    return accessToken;
}
export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
) {
    return Session.updateOne(query, update);
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    return Session.find(query).lean();
}
