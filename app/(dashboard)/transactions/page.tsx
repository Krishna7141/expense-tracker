"use client";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TransactionTable from "./_components/TransactionTable";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Category } from "@prisma/client";
import { apiConnector } from "@/lib/apiConnector";
import { Check, ChevronsUpDown } from "lucide-react";
import { TransactionType } from "@/lib/types";


function TransactionsPage() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [open2, setOpen2] = React.useState(false);
    const [value2, setValue2] = React.useState("");
    const [dateRange, setDateRange] = useState<{from:Date, to:Date}>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const types:string[] = ["all", "income", "expense"];
    const getCategories = async () => {
        const res = await apiConnector("GET", `/api/categories`, null, null, null);
        console.log(res.data?.data);
        setCategories(res.data?.data);
    }
    useEffect(() => {
        getCategories();
    }, [])

    const [selectedCategory, setSelectCategory] = useState<Category>();
    const [selectedType, setSelectType] = useState<string>("");

	return (
        <div>
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <div>
                        <p className="text-3xl font-bold">Transactions History</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Popover open={open2} onOpenChange={setOpen2}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    role="combobox"
                                    aria-expanded={open2}
                                    className="w-[200px] justify-between"
                                >
                                    {selectedType ? (
                                        <TypeData type={selectedType} />
                                    ) : (
                                        "Filter by Type"
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command onSubmit={e => e.preventDefault()}>
                                    <CommandInput placeholder="Search Type..."/>
                                    <CommandEmpty>
                                        <p>Category Not Found</p>
                                        <p className="text-xs text-muted-foreground">
                                            Create a New category
                                        </p>
                                    </CommandEmpty>
                                    <CommandGroup>
                                        <CommandList>
                                            {
                                                types && types.map(
                                                    (type: string) => (
                                                        <CommandItem className="justify-between" key={type} onSelect={() => {
                                                            setValue2(type);
                                                            setSelectType(type);
                                                            setOpen2(prev => !prev);
                                                        }}>
                                                            <TypeData type={type}/>
                                                            <Check
                                                                className={`mr-2 w-4 h-4 opacity-0 ${value===type && "opacity-100"}`}
                                                            />
                                                        </CommandItem>
                                                    )
                                                )
                                            }
                                        </CommandList>
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                >
                                    {selectedCategory ? (
                                        <CategoryData category={selectedCategory} />
                                    ) : (
                                        "Filter by Category"
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command onSubmit={e => e.preventDefault()}>
                                    <CommandInput placeholder="Search Category..."/>
                                    <CommandEmpty>
                                        <p>Category Not Found</p>
                                        <p className="text-xs text-muted-foreground">
                                            Create a New category
                                        </p>
                                    </CommandEmpty>
                                    <CommandGroup>
                                        <CommandList>
                                            {
                                                categories && categories.map(
                                                    (category: Category) => (
                                                        <CommandItem className="justify-between" key={category.name} onSelect={() => {
                                                            setValue(category.name);
                                                            setSelectCategory(category);
                                                            setOpen(prev => !prev);
                                                        }}>
                                                            <CategoryData category={category}/>
                                                            <Check
                                                                className={`mr-2 w-4 h-4 opacity-0 ${value===category.name && "opacity-100"}`}
                                                            />
                                                        </CommandItem>
                                                    )
                                                )
                                            }
                                        </CommandList>
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
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
                                // getStatsData(from, to);
                                // getCategoryStatsData(from, to);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="container">
                <TransactionTable selectedType={selectedType || ""} selectedCategory={selectedCategory?.name || ""} from={dateRange.from} to={dateRange.to}/>
            </div>
        </div>
    );
}

function CategoryData({category}:{category:Category}) {
    return (
        <div className="">
            <span role="img">{category.icon}</span>
            <span>{category.name}</span>
        </div>
    )
}

function TypeData({type}:{type:string}) {
    return (
        <div className={`${type==="income" && "text-green-500"} ${type==="expense" && "text-red-500"} ${type==="all" && "text-blue-500"}`}>{type}</div>
    )
}

export default TransactionsPage;