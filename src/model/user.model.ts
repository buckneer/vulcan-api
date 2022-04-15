import {Document, model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import "dotenv/config"
import Item, {ItemDocument} from "./item.model";


export interface UserDocument extends Document {
    email: string;
    name: string;
    password: string;
    zeahCoins: number;
    items: ItemDocument['_id'][];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        zeahCoins: {type: Number, default: "0"},
        items: [{type: Schema.Types.ObjectId, ref: "Item"}]
    },
    { timestamps: true }
);

UserSchema.pre('save', async function(next: any) {
    let user = this as UserDocument;

    if(!user.isModified("password")) return next();
    let workFactor = parseInt(process.env.SALT_WORK_FACTOR as string) as number;
    const salt = await bcrypt.genSalt(workFactor);
    user.password = bcrypt.hashSync(user.password, salt);


    return next();


})

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as UserDocument;

    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}

const User = model<UserDocument>("User", UserSchema);

export default User;

