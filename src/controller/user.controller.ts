import {addCoins, createUser, getUser} from '../service/user.service';
import {Request, Response} from "express";
import {get, omit} from "lodash";
import log from "../logger";
import {UserDocument} from "../model/user.model";


export async function createUserHandler(req: Request, res: Response) {
    try {
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), "password"));
    } catch (error: any){
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function getUserHandler(req: Request, res: Response) {
    try {
        let user = get(req, "user");
        const currUser = await getUser({_id: user._id}) as UserDocument
        const pop = await currUser.populate("items") as UserDocument;
        return res.send(omit(pop.toJSON(), "password"))
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function getCoinsHandler(req: Request, res: Response) {
    let user = get(req, "user");

    try {
        return res.send({coins: user.zeahCoins});
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function addCoinsHandler(req: Request, res: Response) {
    let userId = get(req, "user._id");
    let requestBody = req.body;

    try {
        let user = await addCoins({_id: userId}, requestBody.quantity)
        return res.send(omit(user.toJSON(), "password"));
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }

}
