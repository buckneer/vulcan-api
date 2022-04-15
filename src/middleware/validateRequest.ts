import {AnySchema} from 'yup';
import {NextFunction, Request, Response} from "express";
import log from "../logger";

const validate = (schema: AnySchema) => async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        await schema.validate({
            body: request.body,
            query: request.query,
            params: request.params
        });
        return next();
    } catch (e: any) {
        log.error(e);
        return response.status(400).send(e.errors);
    }
}

export default validate;
