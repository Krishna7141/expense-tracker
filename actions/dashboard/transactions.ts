"use server";

import prisma from "@/lib/prisma";
import { CreateCategorySchema } from "@/schemas/categories";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createTransaction(form:CreateTransactionSchemaType) {
    try {
        const parsedBody = CreateTransactionSchema.safeParse(form);
        if(!parsedBody.success) {
            throw new Error(parsedBody.error.message);
        }

        const user = await currentUser();
        if(!user) {
            redirect("/sign-in");
        }
        
        const {amount, category, date, description, type} = parsedBody.data;
        const categoryData = await prisma.category.findFirst({
            where: {
                userId: user.id,
                name: category,
            },
        });

        if(!categoryData) {
            throw new Error("Category Not Found");
        }

        const newTransaction = await prisma.$transaction([
            prisma.transactions.create({
                data: {
                    userId: user.id,
                    amount,
                    date,
                    description: description || "",
                    type,
                    category: categoryData.name,
                    categoryIcon: categoryData.icon,
                }
            }),
            prisma.monthHistory.upsert({
                where: {
                    day_month_year_userId: {
                        userId: user.id,
                        day: date.getUTCDate(),
                        month: date.getUTCMonth(),
                        year: date.getUTCFullYear(),
                    }
                },
                create: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                    expense: type==="expense" ? amount : 0,
                    income: type==="income" ? amount : 0,
                },
                update: {
                    expense: {
                        increment: type==="expense" ? amount : 0,
                    },
                    income: {
                        increment: type==="income" ? amount : 0,
                    }
                }
            }),
            prisma.yearHistory.upsert({
                where: {
                    month_year_userId: {
                        userId: user.id,
                        month: date.getUTCMonth(),
                        year: date.getUTCFullYear(),
                    }
                },
                create: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                    expense: type==="expense" ? amount : 0,
                    income: type==="income" ? amount : 0,
                },
                update: {
                    expense: {
                        increment: type==="expense" ? amount : 0,
                    },
                    income: {
                        increment: type==="income" ? amount : 0,
                    }
                }
            })
        ]);

        return newTransaction;
    } catch(err) {
        console.log(err);
    }
}