import Cart, {CartDocument} from "../model/cart.model";
import {buyItem} from "./item.service";
import User, {UserDocument} from "../model/user.model";
import {ItemDocument} from "../model/item.model";
import {create, StoreItem} from "../model/storeitem.model";
import "dotenv/config"


export async function createCart(userId: string) {

}

export async function getCart(userId: string) {
    try {

        // Check if user has cart

        // If yes, return cart,
        // If not, create a new cart
        let userCart = await Cart.findOne({user: userId}).populate("items") as CartDocument;
        if(!userCart) {
            let data : {
                user: string,
                items: ItemDocument[];
            } = {
                user: userId,
                items: []
            }

            await Cart.create(data)

            userCart = await Cart.findOne({user: userId}).populate("items") as CartDocument;
        }


        return userCart;
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

export async function checkout(userId: string) {


    try {
        let userCart = await Cart.findOne({user: userId}).populate("items") as CartDocument;
        let user = await User.findOne({_id: userId}).populate("items") as UserDocument;
        let total = 0;

        userCart.items.map(item => {
            total += parseInt(item.price);
        })

        if(total > user.zeahCoins) {
            return {user, valid: false}
        }
        // Deduct coins from user's account
        user.zeahCoins -= total;


        // Add items to account
        user.items.push.apply(user.items, userCart.items)

        userCart.items.map(item => {
            let newItem : StoreItem = {
                id: 1,
                item_name: item.name,
                username: user.name,
                payment_method: "paypal"
            }

            create(newItem, (err: Error, storeItem: number) => {
                if(err) {
                    return {user, valid: false}
                }
            })




            console.log(newItem);
        })

        await user.save();

        // Clear the cart
        userCart.items = []
        await userCart.save()

        return {user, valid: true};



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
