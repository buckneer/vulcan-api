import {Express, Request, Response} from "express";
import {addCoinsHandler, createUserHandler, getCoinsHandler, getUserHandler} from "./controller/user.controller";
import validateRequest from "./middleware/validateRequest";
import {addCoinsSchema, createUserSchema, createUserSessionSchema} from "./schema/user.schema";
import {
    createUserSessionHandler,
    getUserSessionsHandler,
    invalidateUserSessionHandler
} from "./controller/session.controller";
import requiresUser from "./middleware/requiresUser";
import {createItemSchema, itemSchema} from "./schema/item.schema";
import {
    addItemHandler, deleteItemHandler,
    getAllItemsHandler,
    getItemsByCategoryHandler,
    handleBuyItem
} from "./controller/item.controller";
import {
    addToCartHandler,
    checkoutHandler,
    clearCartHandler,
    getCartHandler,
    removeFromCartHandler
} from "./controller/cart.controller";
import {itemToCart} from "./schema/cart.schema";


export default function(app: Express) {
    app.get('/healthcheck', (req : Request, res: Response) => res.sendStatus(200))


    // Register
    app.post("/api/users", validateRequest(createUserSchema), createUserHandler);


    // Login
    app.post("/api/sessions", validateRequest(createUserSessionSchema), createUserSessionHandler);
    app.get("/api/user/", requiresUser, getUserHandler);


    // add zeah coins
    app.post("/api/zeah", [validateRequest(addCoinsSchema), requiresUser], addCoinsHandler);
    app.get("/api/zeah", requiresUser, getCoinsHandler)


    // shopping cart
    app.get("/api/cart", requiresUser, getCartHandler);
    app.get("/api/cart/checkout", requiresUser, checkoutHandler);
    app.post("/api/cart", [validateRequest(itemToCart), requiresUser], addToCartHandler);
    app.delete("/api/cart", [validateRequest(itemToCart), requiresUser], removeFromCartHandler);
    app.delete("/api/clear", requiresUser, clearCartHandler);

    // items
    app.post("/api/buy", [validateRequest(itemSchema), requiresUser], handleBuyItem);
    app.get("/api/items", getAllItemsHandler);
    app.get("/api/items/:category", getItemsByCategoryHandler);
    app.post("/api/items", [validateRequest(createItemSchema), requiresUser], addItemHandler);
    app.delete("/api/items", [validateRequest(itemSchema), requiresUser], deleteItemHandler)

    // Get all active user sessions
    app.get("/api/sessions", requiresUser, getUserSessionsHandler);

    // Logout
    app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);
}
