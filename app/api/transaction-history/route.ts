import { formatCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { AccountQuerySchema } from "@/schemas/account";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const user = await currentUser();
		if (!user) {
			return redirect("/sign-in");
		}

		const { searchParams } = new URL(request.url);
		const from = searchParams.get("from");
		const to = searchParams.get("to");
        const categ = searchParams.get("categ") || "";
        const type = searchParams.get("type") || "";
		const page = parseInt(searchParams.get("page") || "0");
		const pageSize = parseInt(searchParams.get("pageSize") || "10");

        console.log(categ);

		const queryParams = AccountQuerySchema.safeParse({ from, to });
		if (!queryParams.success) {
			return NextResponse.json(
				{
					error: queryParams.error.message,
				},
				{ status: 400 }
			);
		}

		const { transactions, totalTransactions } =
			await getTransactionsHistory(
				user.id,
				queryParams.data.from,
				queryParams.data.to,
                categ,
                type,
				page,
				pageSize
			);

		return NextResponse.json({
			data: transactions,
			totalTransactions,
		});
	} catch (err) {
		console.log(err);
		return NextResponse.json({
			error: err,
		}, {status: 500});
	}
}

export type GetTransactionsHistoryResponseType = Awaited<
	ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(
	userId: string,
	from: Date,
	to: Date,
    categ: string,
    type: string,
	page: number,
	pageSize: number
) {
	const userSettings = await prisma.userSettings.findUnique({
		where: {
			userId,
		},
	});
	if (!userSettings) {
		throw new Error("User Settings Not found");
	}

	const transactions = await prisma.transactions.findMany({
		where: {
			userId,
			date: {
				gte: from,
				lte: to,
			},
            ...(categ!=="" && {category: categ}),
            ...(type!=="" && {type: type})
		},
		orderBy: {
			date: "desc",
		},
		skip: page*pageSize,
		take: pageSize,
	});

	const totalTransactions = await prisma.transactions.count({
		where: {
			userId,
			date: {
				gte: from,
				lte: to,
			},
		},
	});

	return {
		transactions: transactions.map((transaction) => ({
			...transaction,
			formattedAmount: formatCurrency(transaction.amount),
		})),
		totalTransactions,
	};
}