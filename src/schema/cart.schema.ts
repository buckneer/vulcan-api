import {object, string} from "yup";


export const itemToCart = object({
    body: object({
        itemId: string().required("Item Id is required")
    }),
})
