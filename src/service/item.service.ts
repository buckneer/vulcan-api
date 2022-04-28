import Item, {ItemDocument} from "../model/item.model"
import User, {UserDocument} from "../model/user.model";
import {DocumentDefinition, FilterQuery} from "mongoose";
import log from "../logger";

export async function getAllItems() {
    try {
        let items = await Item.find() as ItemDocument[];
        return items;
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function getItemsByCategory(query: FilterQuery<ItemDocument>) {
    try {
        let items = await Item.find(query) as ItemDocument[];
        return items
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function addItem(input: DocumentDefinition<ItemDocument>, userId: string) {
    try {
        let user = await User.findOne({_id: userId}) as UserDocument;
        if(user.role === "admin") {
            return Item.create(input);
        } else {
            return null;
        }
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function deleteItem(itemId: string, userId: string) {
    try {
        let user = await User.findOne({_id: userId}) as UserDocument;
        if(user.role === "admin") {
            return await Item.deleteOne({_id: itemId});
        } else {
            return null;
        }
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function buyItem(itemId: string, userId: string) {
    let user = await User.findOne({_id: userId}) as UserDocument;



    let item = await findItem({_id: itemId});


    let price = item.price.replace(/\D/g, "");
    let coins = user.zeahCoins;

    if(coins < price) {
        return {user, valid: false}
    } else {
        user.items.push(itemId);
        user.zeahCoins = coins - price;
        await user.save();
        return {user, valid: true}
    }
}


export function findItem(query: FilterQuery<ItemDocument>) {
    return Item.findOne(query);
}
