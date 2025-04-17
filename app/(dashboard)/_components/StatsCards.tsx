"use client";
import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import { Card } from "@/components/ui/card";
import { apiConnector } from "@/lib/apiConnector";
import { dateToUTCDate, formatCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, ChevronsDown, ChevronsUp, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import CountUp from 'react-countup';


interface Props {
    from: Date;
    to: Date;
    statsData: GetBalanceStatsResponseType | undefined;
    userSettings: UserSettings;
}

function StatsCards({from, to, statsData, userSettings}:Props) {
    // const [statsData, setStatsData] = useState<GetBalanceStatsResponseType>();
    const [loading, setLoading] = useState(false);
    // const getStatsData = async() => {
    //     setLoading(true);
    //     const res = await apiConnector("GET", `/api/stats/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`, null, null, null);
    //     console.log(res.data?.data);
    //     setStatsData(res.data?.data);
    //     setLoading(false);
    // }
    // useEffect(() => {
    //     getStatsData();
    // }, []);
    console.log(statsData);

    // const formatter = () => {
    //     formatCurrecncy("INR");
    // }

    const income = statsData?.income || 0;
    const expense = statsData?.expense || 0;
    const balance = income-expense;

	return (
        <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
            <div className="container">
                {
                    loading 
                    ? <div>Loading...</div>
                    :
                    <div className="flex flex-wrap gap-3 md:flex-nowrap">
                        <EachStatCard
                            // formatter={formatter}
                            value={income}
                            title="Income"
                            style="shadow-green-500"
                            icon={
                                <ChevronsUp className="h-16 w-16 items-center rounded-lg p-2 text-green-500 bg-green-950"/>
                            }
                        />
                        <EachStatCard
                            // formatter={formatter}
                            value={expense}
                            title="Expense"
                            style="shadow-red-500"
                            icon={
                                <ChevronsDown className="h-16 w-16 items-center rounded-lg p-2 text-red-500 bg-red-950"/>
                            }
                        />
                        <EachStatCard
                            // formatter={formatter}
                            value={balance}
                            title="Balance"
                            style="shadow-blue-500"
                            icon={
                                <Wallet className="h-16 w-16 items-center rounded-lg p-2 text-blue-500 bg-blue-950"/>
                            }
                        />
                    </div>
                }
            </div>
        </div>
    );
}

function EachStatCard({/*formatter, */value, title, icon, style}:{/*formatter:Intl.NumberFormat,*/ icon: ReactNode, title: string, value: number, style:string}) {
    // const formatFn = useCallback(
    //     (value:number) => {
    //         return formatter.format(value);
    //     }, [formatter]
    // );
    // const formatFn = formatCurrency(value);

    return (
        <Card className={`flex ${style} shadow-md h-24 w-full items-center gap-5 p-4`}>
            <div>{icon}</div>
            <div className="flex flex-col gap-0">
                <p className="text-muted-foreground text-lg text-start">{title}</p>
                <div className="flex items-center text-2xl">
                    <p>₹</p>
                    <CountUp
                        preserveValue
                        redraw={false}
                        end={value}
                        decimals={2}
                        duration={1}
                        formattingFn={formatCurrency}
                    />
                </div>
            </div>
        </Card>
    )
}

export default StatsCards;