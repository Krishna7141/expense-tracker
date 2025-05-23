"use client";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schemas/transaction";
import React, { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { createTransaction } from "@/actions/dashboard/transactions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

function CreateTransactionDialog({trigger, type}:Props) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),
        }
    });

    const handleCategoryChange = useCallback((value:string) => {
        form.setValue("category", value);
    }, [form]);

    const submitTransaction = async (values:CreateTransactionSchemaType) => {
        const toastId = toast.loading("Adding Transaction...");
        const res = await createTransaction(values);
        toast.dismiss(toastId);
        toast.success("Transaction Added");
        setOpen(prev => !prev);
        console.log(res);
        // await router.refresh();
        location.reload();
    }

	return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Add new <span className={`${type==="income" ? "text-green-600" : "text-red-600"}`}>{type==="income" ? "Income" : "Expense"}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="space-y-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Amount *</FormLabel>
                                        <FormControl>
                                            <Input defaultValue={0} type="number" {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input defaultValue={""} {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-between gap-2 /*gap-16*/">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Category *</FormLabel>
                                            <FormControl>
                                                <CategoryPicker type={type} onChange={handleCategoryChange}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Transaction Date *</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"}
                                                            className={`w-[200px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                        >
                                                            {field.value ? (format(field.value, "PPP")) : (<span>Pick a Date</span>)}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={field.value} 
                                                        onSelect={value => {
                                                            if(!value) return;
                                                            field.onChange(value);
                                                        }
                                                    } initialFocus/>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button type="button" variant={"secondary"}
                                onClick={() => {form.reset();}}
                                >
                                    Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={form.handleSubmit(submitTransaction)}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateTransactionDialog;