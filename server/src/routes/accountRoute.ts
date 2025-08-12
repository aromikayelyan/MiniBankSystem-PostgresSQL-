import { Router } from "express";
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../utils/utils'
import { PrismaClient } from "../generated/prisma/index";


const prisma = new PrismaClient()

const router = Router()



router.get('/getall', async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
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
        let { name, telNum, pin, password } = req.body

        password = bcrypt.hashSync(password, 7)

        console.log(password)

        const newUser = await prisma.user.create({
            data: {
                name,
                balance: 0,
                telNum,
                pin,
                password
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



router.post('/log', async (req, res) => {
    try {
        const { telNum, password } = req.body
        const user = await prisma.user.findUnique({
                where: {
                    telNum
                }
            })
        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден!" })
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({ message: "Введен неправильный пароль!" })
        }

        const token = generateAccessToken(user.id)
        return res.json({token})
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Ошибка" })

    }
})




export default router