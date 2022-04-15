import {get, omit} from "lodash";
import {addItem, buyItem, deleteItem, getAllItems, getItemsByCategory} from "../service/item.service";
import {Request, Response} from "express";
import Store, {ItemDocument} from "../model/item.model";
import log from "../logger";


export async function handleBuyItem(req: Request, res: Response) {

    try {
        let userId = get(req, "user._id");
        let itemId = req.body.itemId

        if(!itemId) return res.sendStatus(501)

        let {user, valid} = await buyItem(itemId, userId);

        if(!valid) return res.send({"message": "Not enough coins"})

        return res.send(omit(user.toJSON(), "password"));
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function getAllItemsHandler(req: Request, res: Response) {
    try {
        let items = await getAllItems();
        return res.send(JSON.stringify(items));
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function getItemsByCategoryHandler(req: Request, res: Response) {
    try {
        let category = get(req, "params.category");
        let items = await getItemsByCategory({category});
        return res.send(JSON.stringify(items));
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function addItemHandler(req: Request, res: Response) {
    try {
        let item = await addItem(req.body) as ItemDocument;
        return res.send(item.toJSON());
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function deleteItemHandler(req: Request, res: Response) {
    try {
        let itemId = req.body.itemId;
        await deleteItem(itemId);
        return res.sendStatus(200)
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}
