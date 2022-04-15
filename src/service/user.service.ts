import User, {UserDocument} from '../model/user.model';
import {DocumentDefinition, FilterQuery} from 'mongoose';
import {omit} from "lodash";
import log from "../logger";

export async function createUser(input: DocumentDefinition<UserDocument>) {
    try {
        return await User.create(input);
    } catch (e: any) {
        throw new Error(e);
    }
}


export function findUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
}

export async function addCoins(query: FilterQuery<UserDocument>, quantity: number) {
    let user = await User.findOne(query) as UserDocument;

    let coins = user.zeahCoins;

    user.zeahCoins = coins + quantity;

    await user.save();

    return user;
}


export async function validatePassword({email, password} : {email: UserDocument['email'], password: string}) {
    const user = await User.findOne({ email });

    if (!user) {
        // @ts-ignore
        return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
        return false;
    }

    return omit(user.toJSON(), "password");
}


export async function getUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query);
}
