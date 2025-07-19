import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index";
import { interestRates } from "../utils/interestRates";
import { deposite, withdraw } from "../utils/bankUtils";


const prisma = new PrismaClient()

const router = Router()



router.get('/getall/:id', async (req, res) =>{
    try {
        const user = await prisma.user.findUnique({where:{
            id: Number(req.params.id)
        }})
        
        const Bankaccounts = await prisma.bankAccount.findMany({where:{
            userId: user?.id
        }})

        const userHistory = await prisma.history.findMany({where:{
            userId: user?.id
        }})
        
        return res.status(200).json({user, Bankaccounts, userHistory})
    } catch (error) {
        console.log(error)
    }
})



router.post('/deposite/:id', async (req, res) =>{
    try {
        const {amount} = req.body
        const user = await prisma.user.findUnique({where:{
            id: Number(req.params.id)
        }})

        let response

        if(user){
            response = await deposite(amount, user.telNum)
        } 
        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
})


router.post('/withdraw/:id', async (req, res) =>{
    try {
        const {amount, pin} = req.body
        const user = await prisma.user.findUnique({where:{
            id: Number(req.params.id)
        }})

        let response

        if(user && user.pin === pin){
            console.log('--')
            response = await withdraw(amount, user.telNum)
        } 
        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
})


router.post('/takecredit/:id', async (req, res) =>{
    try {

        const {amount, creditType} = req.body
        const user = await prisma.user.findUnique({where:{
            id: Number(req.params.id)
        }})

        let newBankaccount
        if (user && amount && creditType) {
            newBankaccount = await prisma.bankAccount.create({
                data: {
                    account: String(Date.now()),
                    balance: amount,
                    type: 'credit',
                    duty:  amount + (amount * interestRates.consumer / 100),
                    interestRate: interestRates.consumer,
                    loanTerm: 36,
                    userId: user.id
                }
            })
        }

        return res.status(200).json({ user, newBankaccount })
    } catch (error) {
        console.log(error)
    }
})



export default router











// router.get('/:num', )
// router.post('/create', )
// router.put('/update', )
// router.delete('/delete/:num', )
