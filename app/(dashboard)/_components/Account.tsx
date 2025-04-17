"use client";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatsCards from "./StatsCards";
import { apiConnector } from "@/lib/apiConnector";
import { dateToUTCDate } from "@/lib/helpers";
import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import CategoryStats from "./CategoryStats";
import { GetCategoryStatsResponseType } from "@/app/api/stats/categories/route";

function Account({userSettings}:{userSettings:UserSettings}) {
    const [dateRange, setDateRange] = useState<{from:Date, to:Date}>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    const [statsData, setStatsData] = useState<GetBalanceStatsResponseType>();
    const [loading, setLoading] = useState(false);
    const getStatsData = async(from:Date, to:Date) => {
        setLoading(true);
        const res = await apiConnector("GET", `/api/stats/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`, null, null, null);
        console.log(res.data?.data);
        setStatsData(res.data?.data);
        setLoading(false);
    }
    const [categoryStatsData, setCategoryStatsData] = useState<GetCategoryStatsResponseType>();
    const getCategoryStatsData = async(from:Date, to:Date) => {
        const res = await apiConnector("GET", `api/stats/categories?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`, null, null, null);
        console.log(res.data?.date);
        setCategoryStatsData(res.data?.data);
    }

    useEffect(() => {
        getStatsData(dateRange.from, dateRange.to);
        getCategoryStatsData(dateRange.from, dateRange.to);
    }, [dateRange.from, dateRange.to, dateRange]);

	return (
        <div className="">
            <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
                <p className="text-3xl font-bold">Account</p>
                <div className="flex items-center gap-3">
                    <DateRangePicker
                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        showCompare={false}
                        onUpdate={values => {
                            const {from, to} = values.range;
                            if(!from || !to) return;
                            if(differenceInDays(to, from) > MAX_DATE_RANGE) {
                                toast.error(`Maximum allowed range is ${MAX_DATE_RANGE}`);
                                return;
                            }
                            setDateRange({from, to});
                            getStatsData(from, to);
                            getCategoryStatsData(from, to);
                        }}
                    />
                </div>
            </div>
            <StatsCards userSettings={userSettings} statsData={statsData} from={dateRange.from} to={dateRange.to}/>
            <CategoryStats userSettings={userSettings} categoryStatsData={categoryStatsData} from={dateRange.from} to={dateRange.to}/>
        </div>
    );
}

export default Account;