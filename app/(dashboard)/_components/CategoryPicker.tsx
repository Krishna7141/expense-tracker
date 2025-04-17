"use client";
import { apiConnector } from "@/lib/apiConnector";
import { TransactionType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsUpDown } from "lucide-react";

interface Props {
    type: TransactionType;
    onChange: (value:string) => void;
}

function CategoryPicker({type, onChange}: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        if(!value) return;
        onChange(value);
    }, [onChange, value]);

    const getCategories = async () => {
        const res = await apiConnector("GET", `/api/categories?type=${type}`, null, null, null);
        console.log(res.data?.data);
        setCategories(res.data?.data);
    }
    useEffect(() => {
        getCategories();
    }, [])

    const selectedCategory = categories.find(
        (category: Category) => category.name===value
    );

	return (
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
                        "Select Category"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command onSubmit={e => e.preventDefault()}>
                    <CommandInput placeholder="Search Category..."/>
                    <CreateCategoryDialog type={type}/>
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

export default CategoryPicker;