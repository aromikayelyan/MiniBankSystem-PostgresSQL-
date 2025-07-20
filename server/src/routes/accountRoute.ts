import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index";


const prisma = new PrismaClient()

const router = Router()




router.get('/:id', async (req, res) => {
    try {
        const id  = Number(req.params.id)
        let user

        if (id) {
            user = await prisma.user.findUnique({
                where: {
                    id
                }
            })
        }
        if (user) {
            return res.status(200).json(user)
        }

        return res.status(200).json({ message: 'not exist' })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/create', async (req, res) => {
    try {
        const {name, telNum, pin } = req.body

        const newUser = await prisma.user.create({
            data: {
                name,
                balance: 0,
                telNum,
                pin
            }
        })

        const newBankaccount = await prisma.bankAccount.create({
            data: {
                account: String(Date.now()),
                balance: 0,
                type: 'debit',
                userId: newUser.id
            }
        })

        return res.status(200).json({ newUser, newBankaccount })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})




export default router