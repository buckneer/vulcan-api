import {Document, model, Schema} from "mongoose";
import {ItemDocument} from "./item.model";
import {UserDocument} from "./user.model";

export interface CartDocument extends Document {
    user: UserDocument['_id'];
    items: ItemDocument['_id'][];
}

const CartSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    items: [
        {type: Schema.Types.ObjectId, ref: "Item"}
    ]
})

const Cart = model<CartDocument>("Cart", CartSchema)

export default Cart;
