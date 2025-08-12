import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';


configDotenv()

const secret = process.env.SECRET_KEY




export function generateAccessToken(id: number){
    const payload = {
        id
    }

    console.log(secret)

    return jwt.sign(payload, secret!, {expiresIn: "24h"})
}