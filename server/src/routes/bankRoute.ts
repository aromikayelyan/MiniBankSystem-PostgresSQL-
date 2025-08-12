import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index";
import { interestRates } from "../utils/interestRates";
import { deposit, withdraw } from "../utils/bankUtils";
import { checkTakeCredit } from "../utils/creditUtils";
import authCheck from "../middleware/authCheck";
import express from 'express'
import user from "../controllers/user";


const prisma = new PrismaClient()

const router = Router()


router.get('/getall', authCheck, async (req: express.Request, res: express.Response) => {
    try {

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })

        if (!user) return res.status(404).json({ message: "User not found" })

        const Bankaccounts = await prisma.bankAccount.findMany({
            where: {
                userId: user?.id
            }
        })

        const userHistory = await prisma.history.findMany({
            where: {
                userId: user?.id
            }
        })

        return res.status(200).json({ user, Bankaccounts, userHistory })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/deposit', authCheck, async (req, res) => {
    try {
        const { amount } = req.body

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })

        if (!user) return res.status(404).json({ message: "User not found" })

        let response = await deposit(amount, user.telNum)

        return res.status(200).json({ message: "Deposit successful", balance: response })
    } catch (error) {
        console.error('[Deposit Error]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/withdraw', authCheck, async (req, res) => {
    try {
        const { amount, pin } = req.body

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })


        let response

        if (user && user.pin === pin) {
            response = await withdraw(amount, user.telNum)
        } else {
            return res.status(401).json({ message: "wrong pin" })
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/checkhistory', authCheck, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })

        const userHistory = await prisma.history.findMany({
            where: {
                userId: user?.id
            }
        })


        if (userHistory) {
            let sum = checkTakeCredit(userHistory)
            if (sum === 0) {
                return res.status(200).json({ message: 'You cant take credit!' })
            }
            return res.status(200).json({ message: `The credit amount you are eligible for is $${sum}.` })
        } else {
            return res.status(200).json({ message: 'You cant take credit!' })
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/transfer', authCheck, async (req, res) => {
    try {
        const { amount, pin, toTelNum } = req.body

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        if (typeof toTelNum !== 'string' || toTelNum.length <= 9) {
            return res.status(400).json({ message: 'Invalid telephone number' });
        }

        const fromUser = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })

        const toUser = await prisma.user.findUnique({
            where: {
                telNum: toTelNum
            }
        })

        const fromDebAcc = await prisma.bankAccount.findFirst({
            where: {
                userId: fromUser?.id
            }
        })




        if (fromUser && fromUser.pin === pin && fromDebAcc && fromDebAcc?.balance > amount) {
            if (!toUser) {
                return res.status(200).json({ message: `wit number - ${toTelNum} User not found` })
            }

            const toDebAcc = await prisma.bankAccount.findFirst({
                where: {
                    userId: toUser?.id
                }
            })

            if (!toDebAcc) {
                return res.status(200).json({ message: `wit number - ${toTelNum} User dont have a bank acoount` })
            }

            const updateFromAcc = await prisma.bankAccount.update({
                where: {
                    id: fromDebAcc.id
                },
                data: {
                    balance: fromDebAcc.balance - amount
                }
            })


            const updateToAcc = await prisma.bankAccount.update({
                where: {
                    id: toDebAcc.id
                },
                data: {
                    balance: toDebAcc.balance + amount
                }
            })

            return res.json({ message: 'Transfer successful' });

        } else {
            return res.status(200).json({ message: "wrong pin" })
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/takecredit', authCheck, async (req, res) => {
    try {

        const { amount, pin, TelNum, creditType } = req.body

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // if (typeof TelNum !== 'string' || TelNum.length <= 9) {
        //     return res.status(400).json({ message: 'Invalid telephone number' });
        // }


        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        })

        if (user) {
            const userHistory = await prisma.history.findMany({
                where: {
                    userId: user.id
                }
            })

            const creditSum = checkTakeCredit(userHistory)

            if (amount > creditSum) {
                return res.status(400).json({ message: `The maximum credit you can take is $${creditSum}.` });
            }

            if (creditSum > 0 && creditSum >= amount && user.pin === pin && creditType) {

                if (typeof creditType !== 'string') {
                    return res.status(400).json({ message: 'Credit type must be a string' });
                }

                const rate = interestRates[creditType as keyof typeof interestRates];

                if (rate === undefined) {
                    return res.status(400).json({ message: 'Invalid credit type' });
                }

                const newBankaccount = await prisma.bankAccount.create({
                    data: {
                        account: String(Date.now()),
                        balance: amount,
                        type: 'credit' + `(${creditType})`,
                        duty: amount + (amount * rate / 100),
                        interestRate: rate,
                        loanTerm: 36,
                        userId: user.id,
                    }
                })
                return res.status(200).json({ message: 'You are successfuly take credit!' });
            }
        }




        return res.status(400).json({ error: 'Try again!' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})



export default router











// router.get('/:num', )
// router.post('/create', )
// router.put('/update', )
// router.delete('/delete/:num', )
