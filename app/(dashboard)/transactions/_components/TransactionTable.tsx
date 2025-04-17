"use client";
import { GetTransactionsHistoryResponseType } from "@/app/api/transaction-history/route";
import { apiConnector } from "@/lib/apiConnector";
import { dateToUTCDate, formatDate } from "@/lib/helpers";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GoTrash } from "react-icons/go";
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ChevronsDown, ChevronsUp, ChevronUp, MoveDown, MoveLeft, MoveUp } from "lucide-react";
import { deleteTransaction } from "@/actions/transactions/deleteTransactions";
import { Category } from "@prisma/client";

interface Props {
    from:Date;
    to:Date;
    selectedType: string;
    selectedCategory:any;
}

// type TransactionsHistory = GetTransactionsHistoryResponseType[0];

function TransactionTable({from, to, selectedType, selectedCategory}:Props) {
	const [history, setHistory] = useState<any>([]);
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const getTransactionsHistory = async () => {
        setLoading(true);
        console.log(typeof selectedCategory);
        const res = await apiConnector("GET", `/api/transaction-history?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}&page=${page}&categ=${selectedCategory}&type=${selectedType!=="all" ? selectedType : ""}`, null, null, null);
        console.log(res.data?.data);
        setHistory(res.data?.data);
        setLoading(false);
    }
    useEffect(() => {
        getTransactionsHistory();
    }, [from, to, page, selectedCategory, selectedType]);

    const handleDeleteTxn = async (id:string) => {
        await deleteTransaction(id);
        location.reload();
    }

    const isDataAvailable = history && history.length>0;
    
    return (
        <div className="mb-10">
            <Table>
                <TableHeader className="text-lg">
                    <TableRow className="bg-gray-900">
                        <TableHead className="border">Category</TableHead>
                        <TableHead className="border">Description</TableHead>
                        <TableHead className="border">Date</TableHead>
                        <TableHead className="border">Type</TableHead>
                        <TableHead className="border">Amount</TableHead>
                        {/* <TableHead className="border">Action</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody className="text-[16px]">
                    {
                        isDataAvailable &&
                        history?.map((item:any) => {
                            return (
                                <TableRow className={`${item.type==="income" ? "hover:bg-green-950" : "hover:bg-red-950"}`} key={item.id}>
                                    {/* {item.categoryIcon} {item.category} {item.type} {item.formattedAmount} {item.date} */}
                                    <TableCell className="border border-l-0">{item.categoryIcon} {item.category}</TableCell>
                                    <TableCell className="border">{item.description ? item.description : "-"}</TableCell>
                                    <TableCell className="border">{formatDate(item.date)}</TableCell>
                                    <TableCell className={`border ${item.type==="income" ? "text-green-500" : "text-red-500"}`}>
                                        <div className="flex items-center">
                                            <p>{item.type==="income" ? <IoIosArrowRoundUp className="text-2xl"/> : <IoIosArrowRoundDown className="text-2xl"/>}</p>
                                            <p className="pl-[3px] font-medium text-[18px]">{item.type==="income" ? "Income" : "Expense"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="border">₹{item.formattedAmount}</TableCell>
                                    {/* <TableCell className="flex border justify-center">
                                        <Button onClick={() => handleDeleteTxn(item.id)} className="bg-red-900 hover:bg-red-500 text-white">
                                            <GoTrash className="text-xl"/>
                                        </Button>
                                    </TableCell> */}
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
                {/* <TableFooter>
                    <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter> */}
                </Table>
            {/* {
                history.map((item:TransactionsHistory) => {
                    return (
                        <div key={item.id}>
                            {item.categoryIcon} {item.category} {item.type} {item.formattedAmount} {item.date}
                        </div>
                    )
                })
            } */}
            {
                isDataAvailable ?
                <div className="flex mt-5 justify-center gap-5">
                    <Button disabled={page===0} className="flex gap-2 text-lg" onClick={() => {
                        if(page!==0) {
                            setPage(page-1);
                            console.log(page);
                        }
                    }}>
                        <ArrowLeft/>
                        <p>Previous</p>
                    </Button>
                    <Button disabled={page>history.length/10 || history.length<10} className={`${""} flex gap-2 text-lg`} onClick={() => {
                        if(page<=history.length/10 || history.length>10) {
                            setPage(page+1);
                            console.log(page);
                        }
                    }}>
                        <p>Next</p>
                        <ArrowRight/>
                    </Button>
                </div>
                :
                !loading &&
                <div className="flex mt-36 items-center justify-center">
                    <p className="text-2xl">No Data Available !!!</p>
                </div>
            }
        </div>
    );
}

export default TransactionTable;