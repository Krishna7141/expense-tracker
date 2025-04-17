import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const user = await currentUser();
    if(!user) {
        return redirect("/sign-in");
    }
    try {
        let userSettings = await prisma.userSettings.findUnique({
            where: {
                userId: user.id,
            }
        });
        if(!userSettings) {
            userSettings = await prisma.userSettings.create({
                data: {
                    userId: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    // currency: "INR",
                }
            })
        }
        revalidatePath("/");
        return NextResponse.json({
            data: userSettings,
        }, {status: 200});
    } catch(err: any) {
        console.log(err);
        // return new NextResponse("Internal Server Error", {status: 500});
        return NextResponse.json({
            error: err?.message,
            message: "Internal Server Error",
        }, {status: 500});
    }
}