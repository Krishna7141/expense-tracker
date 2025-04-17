import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: Request) {
    try {
        const user = await currentUser();
        if(!user) {
            return redirect("/sign-in");
        }
        const {searchParams} = new URL(request.url);
        const paramType = searchParams.get("type");
        const validator = z.enum(["expense", "income"]).nullable();
        const queryParams = validator.safeParse(paramType);
        if(!queryParams.success) {
            return NextResponse.json(queryParams.error, {status: 400});
        }

        const type = queryParams.data;
        const categories = await prisma.category.findMany({
            where: {
                userId: user.id,
                ...(type && {type}),   // include type in filters, if defined
            },
            orderBy: {
                name: "asc",
            },
        });
        return NextResponse.json({
            data: categories,
        }, {status: 200});
    } catch(err: any) {
        console.log(err);
        return Response.json({
            error: err,
        }, {status: 500})
    }
}