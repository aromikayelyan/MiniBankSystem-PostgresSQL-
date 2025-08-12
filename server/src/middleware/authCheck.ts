import jwt from 'jsonwebtoken'
import express  from 'express'


const secretKey = process.env.SECRET_KEY

export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.method === "OPTIONS") {
        return next()
    }

    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(403).json({ message: "пользователь не авторизирован" })
        }
        const decodeData = jwt.verify(token, secretKey!)
        const r = req as express.Request & { user?: any };
        r.user = decodeData
        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: error })
    }
}