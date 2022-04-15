import {Document, model, Schema} from "mongoose";
import {nanoid} from "nanoid";


export interface BondDocument extends Document {
    bondId: string,
    name: string,
    price: string
}



const BondSchema = new Schema({
    bondId: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(10)
    },
    name: {type: String, required: true},
    price: {type: String, required: true},
})

const Bond = model("Bond", BondSchema);


export default Bond;
