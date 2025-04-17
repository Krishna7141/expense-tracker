"use client";
import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiConnector } from "@/lib/apiConnector";
import { Period, TimeFrame } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface Props {
    period:Period;
    setPeriod:(period:Period) => void;
    timeFrame:TimeFrame;
    setTimeFrame:(timeFrame:TimeFrame) => void;
}

function HistoryPeriodSelector({period, setPeriod, timeFrame, setTimeFrame}:Props) {
    const [historyPeriods, setHistoryPeriods] = useState<GetHistoryPeriodsResponseType>([]);
    const getHistoryPeriods = async () => {
        const res = await apiConnector("GET", `/api/history-periods`, null, null, null);
        setHistoryPeriods(res.data?.data);
        console.log(res.data?.data);
    }
    useEffect(() => {
        getHistoryPeriods();
    }, [])
    useEffect(() => {
        getHistoryPeriods();
    }, [period, timeFrame])

	return (
        <div className="flex items-center gap-3">
            <div>
                <Tabs value={timeFrame} onValueChange={value => setTimeFrame(value as TimeFrame)}>
                    <TabsList>
                        <TabsTrigger value="year">Year</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {timeFrame==="month" && (
                    <MonthSelector period={period} setPeriod={setPeriod}/>
                )}
                {timeFrame==="year" && <div>
                    <YearSelector period={period} setPeriod={setPeriod} years={historyPeriods || []}/>
                </div>}
            </div>
        </div>
    );
}

function YearSelector({period, setPeriod, years}:{period:Period, setPeriod:(period:Period) => void, years:GetHistoryPeriodsResponseType}) {
    return (
        <Select value={period.year.toString()} onValueChange={(value) => {
            setPeriod({
                month: period.month,
                year: parseInt(value),
            })
        }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function MonthSelector({period, setPeriod}:{period:Period, setPeriod:(period:Period) => void}) {
    return (
        <Select value={period.month.toString()} onValueChange={(value) => {
            setPeriod({
                year: period.year,
                month: parseInt(value),
            })
        }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue/>
            </SelectTrigger>
            <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
                    const monthstr = new Date(period.year, month, 1).toLocaleString("default", {month: "long"});

                    return (
                        <SelectItem key={month} value={month.toString()}>
                            {monthstr}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}

export default HistoryPeriodSelector;