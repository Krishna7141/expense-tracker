"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { apiConnector } from "@/lib/apiConnector";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { ChevronsDown, ChevronsUp, PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GetCategoryStatsResponseType } from "@/app/api/stats/categories/route";
import { deleteCategory } from "@/actions/dashboard/categories";

function page() {
	return (
        <div className="mb-10">
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <div>
                        <p className="text-3xl font-bold">Manage</p>
                        <p className="pt-1 text-muted-foreground">Manage your Account Categories</p>
                    </div>
                </div>
            </div>
            <div className="container flex flex-col gap-5 p-4">
                <CategoryList type="income"/>
                <CategoryList type="expense"/>
            </div>
        </div>
    );
}

function CategoryList({type}:{type:TransactionType}) {
    const [categories, setCategories] = useState<Category[]>([]);
    const getCategories = async () => {
        const res = await apiConnector("GET", `/api/categories?type=${type}`, null, null, null);
        console.log(res.data?.data);
        setCategories(res.data?.data);
    }
    useEffect(() => {
        getCategories();
    }, [])

    const isDataAvailable = categories && categories.length>0;

    return (
        <div className="">
            <Card className={`shadow-md ${type==="income" ? "shadow-green-500" : "shadow-red-500"}`}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-5">
                            {type==="income" 
                                ? <ChevronsUp className="h-16 w-16 items-center rounded-lg p-2 text-green-500 bg-green-950"/> 
                                : <ChevronsDown className="h-16 w-16 items-center rounded-lg p-2 text-red-500 bg-red-950"/>
                            }
                            <div className="flex flex-col gap-1">
                                {type==="income" ? "Income" : "Expenses"} categories
                                <div className="text-sm text-muted-foreground">
                                    Sorted by names
                                </div>
                            </div>
                        </div>
                        <CreateCategoryDialog type={type} trigger={
                            <Button className="gap-2 text-sm">
                                <PlusSquare className="h-4 w-4"/>
                                Create New
                            </Button>
                        }/>
                    </CardTitle>
                </CardHeader>
                <Separator/>
                {
                    !isDataAvailable && (
                        <div className="flex p-5 h-40 w-full flex-col items-center justify-center">
                            <p>
                                No <span className={`m-1 ${type==="income" ? "text-green-500" : "text-red-500"}`}>{type}</span>{" "}categories yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Create new Category
                            </p>
                        </div>
                    )
                }
                {
                    isDataAvailable && (
                        <div className="grid grid-flow-row gap-2 p-4 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {
                                categories.map((category:Category) => (
                                    <CategoryCard key={category.name} category={category}/>
                                ))
                            }
                        </div>
                    )
                }
            </Card>
        </div>
    )
}

function CategoryCard({category}:{category:Category}) {
    const handleDeleteCategory = async (name:string, type:any) => {
        const isOK = confirm("Are you sure to Delete the Category, it cannot be UnDone ?");
        if(!isOK) return;
        const res = await deleteCategory({name, type});
        console.log(res);
        location.reload();
    }

    return (
        <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span className="text-3xl" role="img">{category.icon}</span>
                <span>{category.name}</span>
            </div>
            <Button onClick={() => handleDeleteCategory(category.name, category.type)} className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20" variant={"secondary"}>
                <TrashIcon className="h-4 w-4"/>
                Remove
            </Button>
        </div>
    )
}

export default page;