"use server";
import prisma from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType, DeleteCategorySchema, DeleteCategorySchemaType } from "@/schemas/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createCategory(form: CreateCategorySchemaType) {
    try {
        const parsedBody = CreateCategorySchema.safeParse(form);
        if(!parsedBody.success) {
            throw new Error("Bad Request");
        }
        const user = await currentUser();
        if(!user) {
            redirect("/sign-in");
        }
        const {name, icon, type} = parsedBody.data;
        return await prisma.category.create({
            data: {
                userId: user.id,
                name,
                icon,
                type
            }
        })
    } catch(err) {
        console.log(err);
    }
}

export async function deleteCategory(form:DeleteCategorySchemaType) {
    try {
        const parsedBody = DeleteCategorySchema.safeParse(form);
        if(!parsedBody.success) {
            throw new Error("Bad Request");
        }
        const user = await currentUser();
        if(!user) {
            redirect("/sign-in");
        }
        return await prisma.category.delete({
            where: {
                name_userId_type: {
                    userId: user.id,
                    name: parsedBody.data.name,
                    type: parsedBody.data.type,
                }
            }
        });
    } catch(err) {
        console.log(err);
    }
}