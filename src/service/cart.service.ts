import Cart, {CartDocument} from "../model/cart.model";
import {DocumentDefinition} from "mongoose";
import log from "../logger";


export async function getCart(userId: string) {
    try {
        let userCart = await Cart.findOne({user: userId}) as CartDocument;
        return userCart.populate("user");
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function addToCart(userId: string, itemId: string) {
    try {
        let userCart = await Cart.findOne({user: userId}) as CartDocument;
        userCart.items.push(itemId);
        return await userCart.save();
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function removeFromCart(userId: string, itemId: string) {
    try {
        let userCart = await Cart.findOne({user: userId}) as CartDocument;

        userCart.items = userCart.items.filter(item => {
            return item.valueOf() !== itemId;
        })

        return await userCart.save();
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function clearCart(userId: string) {
    try {
        let userCart = await Cart.findOne({user: userId}) as CartDocument;
        userCart.items = []
        return await userCart.save();
    } catch (error: any) {
        throw new Error(error);
    }
}
