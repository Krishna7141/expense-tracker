"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schemas/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { MousePointerClick, PlusSquare } from "lucide-react";
import React, { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { createCategory } from "@/actions/dashboard/categories";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

interface Props {
    type: TransactionType;
    trigger?: ReactNode;
}

function CreateCategoryDialog({type, trigger}: Props) {
    const [open, setOpen] = useState(false);
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
        }
    });

    const theme = useTheme();

    const submitCategory = async (values:CreateCategorySchemaType) => {
        const toastId = toast.loading("Creating...");
        const res = await createCategory(values);
        toast.dismiss(toastId);
        console.log("Created Category Response: ", res);
        form.reset({
            name: "",
            icon: "",
            type,
        });
        toast.success("Category Created");
        setOpen(prev => !prev);
    }

	return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {
                    trigger ? trigger :
                    <Button variant={"ghost"} className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground">
                        <PlusSquare className="mr-2 h-4 w-4"/>
                        Create New
                    </Button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new <span className={`${type==="income" ? "text-green-600" : "text-red-600"}`}>{type==="income" ? "Income" : "Expense"}</span> category
                    </DialogTitle>
                    <DialogDescription>
                        To group your Transactions
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitCategory)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name *</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Icon *</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className="h-[100px] w-full">
                                                    {
                                                        form.watch("icon") ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <span className="text-5xl" role="img">{field.value}</span>
                                                                <p className="text-sm text-muted-foreground">Click to Change Icon</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <MousePointerClick className="h-[48px] w-[48px]"/>
                                                                <p className="text-sm text-muted-foreground">Click to Select Icon</p>
                                                            </div>
                                                        )
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full translate-y-28">
                                                <Picker data={data}
                                                    theme={theme.resolvedTheme}
                                                    onEmojiSelect={(emoji:{native:string}) => {
                                                        field.onChange(emoji.native);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant={"secondary"}
                            onClick={() => {form.reset();}}
                            >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(submitCategory)}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCategoryDialog;