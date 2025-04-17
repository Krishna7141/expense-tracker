import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Minus, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Account from "./_components/Account";
import History from "./_components/History";

export default async function Home() {
    const user = await currentUser();
    if(!user) {
        redirect("/sign-in");
    }
    
    let userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
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

    const getNameFromMail = (mail:string|any) => {
        let name = mail?.split('@')[0];
        let ans = name?.charAt(0).toUpperCase()+name?.slice(1);
        return ans;
    }

	return (
		<div className="h-full bg-background">
            <div className="bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <p className="text-3xl font-bold">Hello, {getNameFromMail(user.primaryEmailAddress?.emailAddress)}! 👋</p>
                    <div className="flex gap-5 items-center justify-center">
                        <CreateTransactionDialog
                            trigger={
                                <Button className="text-black text-lg bg-green-500 hover:bg-green-600">
                                    <div className="flex items-center justify-center gap-1">
                                        <Plus/>
                                        <p>Add Income</p>
                                    </div>
                                </Button>
                            } type="income"
                        />
                        <CreateTransactionDialog
                            trigger={
                                <Button className="text-black text-lg bg-red-500 hover:bg-red-600">
                                    <div className="flex items-center justify-center gap-1">
                                        <Minus/>
                                        <p>Add Expense</p>
                                    </div>
                                </Button>
                            } type="expense"
                        />
                    </div>
                </div>
            </div>
            <div>
                <Account userSettings={userSettings}/>
                <History userSettings={userSettings}/>
            </div>
        </div>
	);
}