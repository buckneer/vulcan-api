import {Request, Response} from 'express';
import {validatePassword} from "../service/user.service";
import createAccessToken, {createSession, findSessions, updateSession} from "../service/session.service";
import {UserDocument} from "../model/user.model";

import config from "config";
import {sign} from "../utils/jwt.utils";
import {get} from "lodash";


export async function createUserSessionHandler(request: Request, response: Response) {

    // @ts-ignore
    const user = await validatePassword(request.body) as UserDocument;

    if(!user) {
        return response.status(401).send("Invalid username or password");
    }

//    Create session from services

    const session = await createSession(user._id, request.get("user-agent") || '');

    const accessToken = createAccessToken({user, session});

    // create refresh token
    const refreshToken = sign(session, {
        expiresIn: config.get("refreshTokenTtl") // 1 year
    });


    return response.send({ accessToken, refreshToken });

}

export async function invalidateUserSessionHandler(request: Request, response: Response) {
    const sessionId = get(request, "user.session");

    await updateSession({_id: sessionId}, {valid: false});

    return response.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");

    const sessions = await findSessions({ user: userId, valid: true });

    return res.send(sessions);
}
