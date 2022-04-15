import {Document, model, Schema} from "mongoose";
import {nanoid} from "nanoid";

export interface CoinDocument extends Document {
    coinId: string,
    name: string,
    price: string,
    description: string,
    icon: string,
}


const CoinSchema = new Schema({
    coinId: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(10)
    },
    name: {type: String, required: true},
    price: {type: String, required: true},
    description: {type: String, required: true},
    icon: {type: String, required: true},
})


const Coin = model("Coin", CoinSchema);

export default Coin;
