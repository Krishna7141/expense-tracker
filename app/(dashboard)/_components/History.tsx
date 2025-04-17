"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Period, TimeFrame } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import React, { useEffect, useState } from "react";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { GetHistoryTypeResponseType } from "@/app/api/history-data/route";
import { apiConnector } from "@/lib/apiConnector";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CountUp from "react-countup";
import { formatCurrency } from "@/lib/helpers";

function History({userSettings}:{userSettings:UserSettings}) {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>("year");
    const [period, setPeriod] = useState<Period>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    const [historyData, setHistoryData] = useState<GetHistoryTypeResponseType>([]);
    const getHistoryData = async () => {
        const res = await apiConnector("GET", `/api/history-data?timeframe=${timeFrame}&year=${period.year}&month=${period.month}`, null, null, null);
        console.log(res.data?.data);
        setHistoryData(res.data?.data);
    }
    // useEffect(() => {
    //     getHistoryData();
    // }, [])
    useEffect(() => {
        getHistoryData();
    }, [timeFrame, period])

    const isDataAvailable = historyData && historyData.length>0;

	return (
        <div className="container mb-10">
            <p className="mt-12 mb-3 text-3xl font-bold">Tranactions History</p>
            <Card className="col-span-12 mt-2 shadow-yellow-500 shadow-md w-full">
                <CardHeader className="gap-2">
                    <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
                        <HistoryPeriodSelector period={period} setPeriod={setPeriod} timeFrame={timeFrame} setTimeFrame={setTimeFrame}/>
                        <div className="flex h-10 gap-2">
                            <Badge variant={"outline"} className="flex items-center gap-2 text-sm">
                                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                                Income
                            </Badge>
                            <Badge variant={"outline"} className="flex items-center gap-2 text-sm">
                                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                                Expense
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        {
                            isDataAvailable &&
                            <ResponsiveContainer width={"100%"} height={300}>
                                <BarChart height={300} data={historyData} barCategoryGap={5}>
                                    <defs>
                                        <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset={"0"} stopColor="rgb(34 197 94)" stopOpacity={"1"}/>
                                            <stop offset={"1"} stopColor="rgb(34 197 94)" stopOpacity={"0"}/>                                                
                                        </linearGradient>
                                        <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset={"0"} stopColor="rgb(239 68 68)" stopOpacity={"1"}/>
                                            <stop offset={"1"} stopColor="rgb(239 68 68)" stopOpacity={"0"}/>                                                
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="5 5" strokeOpacity={"0.2"} vertical={false}/>
                                    <XAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} padding={{left: 5, right: 5}} dataKey={(data) => {
                                        const {year, month, day} = data;
                                        const date = new Date(year, month, day || 1);
                                        if(timeFrame==="year") {
                                            return date.toLocaleDateString("default", {
                                                month: "long",
                                            });
                                        }
                                        return date.toLocaleDateString("default", {
                                            day: "2-digit",
                                        });
                                    }}/>
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                    <Bar dataKey={"income"} label="Income"  fill="url(#incomeBar)" radius={4} className="cursor-pointer"/>
                                    <Bar dataKey={"expense"} label="Expense"  fill="url(#expenseBar)" radius={4} className="cursor-pointer"/>
                                    <Tooltip cursor={{opacity: 0.1}} content={(props) => (
                                        <CustomTooltip {...props}/>
                                    )}/>
                                </BarChart>
                            </ResponsiveContainer>
                            }
                            {
                                !isDataAvailable &&
                                (
                                    <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                                        No Data found for the Selected Range
                                        <p className="text-sm pt-1 text-muted-foreground">
                                            Select different Range
                                        </p>
                                    </Card>
                                )
                            }
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function CustomTooltip({active, payload}:any) {
    if(!active || !payload || payload.length===0) return null;
    const data = payload[0].payload;
    const {expense, income} = data;
    return (
        <div className="min-w-[300px] rounded border bg-background p-4">
            <TooltipRow label="Income" value={income} bgColor="bg-green-500" textColor="text-green-500"/>
            <TooltipRow label="Expense" value={expense} bgColor="bg-red-500" textColor="text-red-500"/>
            <TooltipRow label="Balance" value={income-expense} bgColor="bg-blue-500" textColor="text-blue-500"/>
        </div>
    )
}

function TooltipRow({label, value, bgColor, textColor}:{label:string, value:number, bgColor:string, textColor:string}) {
    return (
        <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded-full ${bgColor}`}/>
            <div className="flex w-full justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className={`text-sm font-bold ${textColor}`}>
                    <CountUp
                        duration={0.5}
                        preserveValue
                        end={value}
                        decimals={0}
                        formattingFn={formatCurrency}
                        className="text-sm"
                    />
                </div>
            </div>
        </div>
    )
}

export default History;