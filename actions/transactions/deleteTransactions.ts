"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function deleteTransaction(id:string) {
    const user = await currentUser();
    if(!user) {
        redirect("/sign-in");
    }
    const isTxnExists = await prisma.transactions.findUnique({
        where: {
            userId: user.id,
            id,
        }
    });
    if(!isTxnExists) {
        return;
    }
    const transaction = await prisma.transactions.delete({
        where: {
            userId: user.id,
            id,
        },
    });
    if(!transaction) {
        throw new Error("Transaction Do not Exists");
    }
    await prisma.$transaction([
        prisma.transactions.delete({
            where: {
                id,
                userId: user.id,
            }
        }),
        prisma.monthHistory.update({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: transaction.date.getUTCDate(),
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                }
            },
            data: {
                ...(transaction.type==="expense" && {
                    expense: {
                        decrement: transaction.amount,
                    }
                }),
                ...(transaction.type==="income" && {
                    income: {
                        decrement: transaction.amount,
                    }
                })
            }
        }),
        prisma.yearHistory.update({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                }
            },
            data: {
                ...(transaction.type==="expense" && {
                    expense: {
                        decrement: transaction.amount,
                    }
                }),
                ...(transaction.type==="income" && {
                    income: {
                        decrement: transaction.amount,
                    }
                })
            }
        })
    ]);
}