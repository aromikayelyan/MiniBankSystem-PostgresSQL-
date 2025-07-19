import express from "express";

import { PrismaClient } from "../generated/prisma/index";
import { interestRates } from "../utils/interestRates";
import { deposite, withdraw } from "../utils/bankUtils";
import { checkTakeCredit } from "../utils/creditUtils";


const prisma = new PrismaClient()


class AccountController {
    getAccount = async (req: express.Request, res: express.Response) => {
        try {
            
        } catch (error) {
            
        }
    }

    createAccount = async (req: express.Request, res: express.Response) => {
        try {
            
        } catch (error) {
            
        }
    }
}

export default new AccountController()