import {db} from "../db/mysqlConnect";
import {OkPacket} from "mysql2";


export interface BasicStoreItem {
    id: number
}

export interface StoreItem extends BasicStoreItem {
    item_name: string,
    username: string,
    payment_method: string
}


export const create = (item: StoreItem, callback: Function) => {
    const query = "INSERT INTO vulcanstore (username, item_name, payment_method) VALUES (?, ?, ?)";
    db.query(
        query,
        [item.username,
        item.item_name,
        item.payment_method],
        (err, result) => {
            if (err) {callback(err)}
            const insertId = (<OkPacket> result).insertId;
            callback(null, insertId);
        }
    )
}
