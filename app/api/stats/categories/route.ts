import prisma from "@/lib/prisma";
import { AccountQuerySchema } from "@/schemas/account";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request:Request) {
    try {
        const user = await currentUser();
        if(!user) {
            return redirect("/sign-in");
        }
        const {searchParams} = new URL(request.url);
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const queryParams = AccountQuerySchema.safeParse({from, to});
        if(!queryParams.success) {
            throw new Error(queryParams.error.message);
        }
        const stats = await getCategoryStats(user.id, queryParams.data.from, queryParams.data.to);
        return NextResponse.json({
            data: stats,
        })
    } catch(err) {
        console.log(err);
        return NextResponse.json({
            error: err,
        }, {status: 500})
    }
}

export type GetCategoryStatsResponseType = Awaited<ReturnType<typeof getCategoryStats>>;

async function getCategoryStats(userId:string, from:Date, to:Date) {
    const stats = await prisma.transactions.groupBy({
        by: ["type", "category", "categoryIcon"],
        where: {
            userId,
            date: {
                gte: from,
                lte: to
            }
        },
        _sum: {
            amount: true
        },
        orderBy: {
            _sum: {
                amount: "desc",
            },
        }
    });

    return stats;
}