"use client";
import { GetCategoryStatsResponseType } from "@/app/api/stats/categories/route";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import React from "react";

interface Props {
    userSettings:UserSettings;
    categoryStatsData: GetCategoryStatsResponseType | undefined;
    from:Date;
    to:Date;
}

function CategoryStats({userSettings, categoryStatsData, from, to}:Props) {
    console.log(categoryStatsData);
    return (
        <div className="container mt-4">
            <div className="flex flex-wrap md:flex-nowrap gap-3">
                <CategoryCard
                    type="income"
                    data={categoryStatsData || []}
                    style="shadow-green-500"
                />
                <CategoryCard
                    type="expense"
                    data={categoryStatsData || []}
                    style="shadow-red-500"
                />
            </div>
        </div>
    );
}

function CategoryCard({data, type, style}:{data: GetCategoryStatsResponseType, type:TransactionType, style:string}) {
    const filteredData = data.filter(d => d.type===type);
    const total = filteredData.reduce((acc, d) => acc+(d._sum?.amount || 0), 0);
    
    return (
        <Card className={`${style} h-80 shadow-md w-full col-span-6`}>
            <CardHeader>
                <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground /*text-gray-300*/ md:grid-flow-col">
                    {type==="income" ? "Income" : "Expenses"} by Category
                </CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between gap-2">
                {filteredData.length===0 && 
                    <div className="flex h-60 w-full flex-col items-center justify-center">
                        No Data for Selected Date Range
                        <p className="text-sm text-muted-foreground">
                            Select different Range or Add new Transaction
                        </p>
                    </div>
                }
                {filteredData.length>0 && 
                    <ScrollArea className="h-60 w-full px-4">
                        <div className="flex w-full flex-col gap-4 p-4">
                            {filteredData.map(item => {
                                const amount = item._sum.amount || 0;
                                const percent = (amount*100)/(total || amount);
                                return (
                                    <div key={item.category} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center text-gray-400">
                                                {item.categoryIcon} {item.category}
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    ({percent.toFixed(0)}%)
                                                </span>
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                ₹{formatCurrency(amount)}
                                            </span>
                                        </div>
                                        <Progress value={percent}
                                            indicator={type==="income" ? "bg-green-500" : "bg-red-500"}    
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                }
            </div>
        </Card>
    );
}

export default CategoryStats;