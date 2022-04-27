import {object, string} from "yup";

export const itemSchema = object({
    body: object({
        itemId: string().required("Item Id is required")
    }),
})

export const createItemSchema = object({
    body: object({
        name: string().required("Name is required"),
        price: string().required("Price is required"),
        category: string().required("Category is required")
    })
})
