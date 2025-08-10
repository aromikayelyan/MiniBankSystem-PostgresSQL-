import express from "express";

import { PrismaClient } from "../generated/prisma/index";
import { interestRates } from "../utils/interestRates";
import { deposit, withdraw } from "../utils/bankUtils";
import { checkTakeCredit } from "../utils/creditUtils";


const prisma = new PrismaClient()


class BankController {

    deposit = async (req: express.Request, res: express.Response) => {
        try {
            
        } catch (error) {
            
        }
    }

    checkCredit = async (req: express.Request, res: express.Response) => {
        try {
            
        } catch (error) {
            
        }
    }


    takeCredit = async (req: express.Request, res: express.Response) => {
        try {
            
        } catch (error) {
            
        }
    }


    moneyWithdraw = async (req: express.Request, res: express.Response) => {
        try {
            
        } catch (error) {
            
        }
    }

    getBalance = async (req: express.Request, res: express.Response) => {
        try {
            
        } catch (error) {
            
        }
    }


    transfer = async (req: express.Request, res: express.Response) => {
        try {
            
        } catch (error) {
            
        }
    }
}

export default new BankController()
