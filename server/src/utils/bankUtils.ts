import { PrismaClient } from "../generated/prisma/index";
import { interestRates } from "../utils/interestRates";

const prisma = new PrismaClient()



export async function deposit(amount: number, telNum: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                telNum: telNum
            }
        })

        let bankAccount

        if (user) {
            bankAccount = await prisma.bankAccount.findFirstOrThrow({
                where: {
                    userId: user.id,
                    type: 'debit'
                }
            })
        }

        if (bankAccount && user) {
            const newbalance = user.balance + amount

            await prisma.user.update({
                where: { id: user.id },
                data: { balance: newbalance }
            })

            await prisma.bankAccount.update({
                where: { id: bankAccount.id },
                data: { balance: newbalance }
            })

            const history = await prisma.history.create({
                data: {
                    action: 'deposite',
                    amount,
                    userId: user.id
                }
            })
        }


        return [user, bankAccount]

    } catch (error) {
        console.log(error)
    }
}




export async function withdraw(amount: number, telNum: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                telNum: telNum
            }
        })

        let bankAccount

        if (user) {
            bankAccount = await prisma.bankAccount.findFirstOrThrow({
                where: {
                    userId: user.id,
                    type: 'debit'
                }
            })
        }

        if (bankAccount && user) {
            const newbalance = user.balance - amount

            if (newbalance >= 0) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { balance: newbalance }
                })

                await prisma.bankAccount.update({
                    where: { id: bankAccount.id },
                    data: { balance: newbalance }
                })

                const history = await prisma.history.create({
                    data: {
                        action: 'withdraw',
                        amount,
                        userId: user.id
                    }
                })
            }
        }

        return [user, bankAccount]

    } catch (error) {
        console.log(error)
    }
}



export async function transfer(amount: number, id: number, toTelNum: string) {
    try {
        const fromUser = await prisma.user.findUnique({
            where: {
                id
            }
        })


        const toUser = await prisma.user.findUnique({
            where: {
                telNum: toTelNum
            }
        })

        

        // if (user) {
        //     bankAccount = await prisma.bankAccount.findFirstOrThrow({
        //         where: {
        //             userId: user.id,
        //             type: 'debit'
        //         }
        //     })
        // }

        // if (bankAccount && user) {
        //     const newbalance = user.balance - amount

        //     if (newbalance >= 0) {
        //         await prisma.user.update({
        //             where: { id: user.id },
        //             data: { balance: newbalance }
        //         })

        //         await prisma.bankAccount.update({
        //             where: { id: bankAccount.id },
        //             data: { balance: newbalance }
        //         })

        //         const history = await prisma.history.create({
        //             data: {
        //                 action: 'withdraw',
        //                 amount,
        //                 userId: user.id
        //             }
        //         })
        //     }
        // }

        // return [user, bankAccount]

    } catch (error) {
        console.log(error)
    }
}