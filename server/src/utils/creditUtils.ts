import { PrismaClient } from "../generated/prisma/index";
import { HistoryRecord } from "../interfaces/history";
import { interestRates } from "../utils/interestRates";




export function checkTakeCredit(history: HistoryRecord[]) {
    let sum = 0

    if (history) {
        history.forEach((el, index) => {
            sum += el.amount
        })
    }

    if (sum >= 20000 && history.length >= 4) {
        const base = sum * 0.1 + history.length * 500;
        const creditLimit = Math.min(base, 50000);
        return Math.round(creditLimit);
    } else {
        return 0
    }
}