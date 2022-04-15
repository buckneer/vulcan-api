import {Request, Response} from "express";
import {get} from "lodash";
import {addToCart, clearCart, getCart, removeFromCart} from "../service/cart.service";
import log from "../logger";


export async function getCartHandler(req: Request, res: Response) {
    try {
        let user = get(req, "user._id");
        let userCart = await getCart(user);
        return res.send(userCart.toJSON());
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}


export async function addToCartHandler(req: Request, res: Response) {


    try {
        let user = get(req, "user._id");
        let item = req.body.itemId;

        let cart = await addToCart(user, item);
        return res.send(cart.toJSON());
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function removeFromCartHandler(req: Request, res: Response) {
    try {
        let user = get(req, "user._id");
        let item = req.body.itemId;

        let cart = await removeFromCart(user, item);
        return res.send(cart.toJSON());
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}

export async function clearCartHandler(req: Request, res: Response) {
    try {
        let user = get(req, "user._id");
        let cart = await clearCart(user);
        return res.send(cart.toJSON());
    } catch (error: any) {
        log.error(error.message);
        return res.status(409).send(error.message)
    }
}
