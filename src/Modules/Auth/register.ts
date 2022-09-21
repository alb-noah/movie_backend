import {NextFunction, Request, Response} from "express";

export const webLogin = async (req: Request, res: Response) => {

    let { name,email,phone, password,birthOfDate } = req.body

    if (email) email = String(email).trim().toLowerCase()


}