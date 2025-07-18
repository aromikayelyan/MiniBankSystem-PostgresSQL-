import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index";


const prisma = new PrismaClient()

const router = Router()




router.get('/', async (req, res) =>{
    try {
        const user = await prisma.user.findMany()

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
})


router.post('/', async (req, res) =>{
    try {
        const newUser = await prisma.user.create({
            data:{
                name:'dd',
                telNum: "3",
                pin: '3333'
            }
        })

        return res.status(200).json(newUser)
    } catch (error) {
        console.log(error)
    }
})



// router.get('/:num', )
// router.post('/create', )
// router.put('/update', )
// router.delete('/delete/:num', )






export default router