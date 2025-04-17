"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { IoMenuOutline } from "react-icons/io5";
import Image from "next/image";
import LogoImg from "@/assets/Logo.png";


function Navbar() {
    const currPath = usePathname();
    let toShow = false;
    if(currPath!=="/sign-in" && currPath!=="/sign-up" && currPath!=="/sign-in/factor-one") {
        toShow = true;
    }

	return (
        <div className={`${toShow ? "block" : "hidden"}`}>
            <LargeScreenNavabar/>
            <MobileNavbar/>
        </div>
    );
}

const navItems = [
    {item: "Dashboard", link: "/"},
    {item: "Transactions", link: "/transactions"},
    {item: "Settings", link: "/settings"},
]

function LargeScreenNavabar() {
    return (
        <div className="hidden md:block border-separate border-b bg-background">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[70px] min-h-[80px] items-center gap-x-32">
                    <Logo/>
                    <div className="flex text-xl items-center gap-5">
                        {navItems.map(i => (
                            <NavItem key={i.item} link={i.link} label={i.item}/>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-10">
                    <Link href={"https://krishnavamshi-portfolio.netlify.app/"} target="_blank">
                        <Button className="text-lg">About</Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        {/* <ThemeSwitcher/> */}
                        <UserButton/>
                    </div>
                </div>
            </nav>
        </div>
    )
}

function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="block md:hidden border bg-background">
            <nav className="container flex justify-between items-center px-5">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <div className="flex gap-2 items-center">
                        <SheetTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                                <IoMenuOutline className="text-3xl"/>
                            </Button>
                        </SheetTrigger>
                        <Logo/>
                        {/* <p className="text-lg font-bold text-app">KashFlow</p> */}
                    </div>
                    <SheetContent className="flex flex-col justify-between w-[400px] sm:w-[540px]" side={"left"}>
                        <div className="flex flex-col pl-5">
                            <div className="flex items-center gap-3">
                                <Image src={LogoImg} alt="logo" className="h-[50px] w-fit"/>
                                <p className="text-lg font-bold text-app">KashFlow</p>
                            </div>
                            <div className="flex flex-col gap-3 text-xl mt-10">
                                {navItems.map(i => (
                                    <NavItem key={i.item} label={i.item} link={i.link}
                                        onClick={() => setIsOpen(prev => !prev)}
                                    />
                                ))}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex h-[70px] min-h-[60px] items-center gap-x-32">
                    {/* <Logo/> */}
                    <div className="flex items-center gap-8">
                        <Link href={"https://krishnavamshi-portfolio.netlify.app/"} target="_blank">
                            <Button className="">About</Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            {/* <ThemeSwitcher/> */}
                            <UserButton/>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

function NavItem({link, label, onClick}:{link:string, label:string, onClick?:()=>void}) {
    const pathname = usePathname();
    const isActive = pathname===link;

    return (
        <div className="relative flex items-center">
            <Link href={link} 
                // className={cn(
                //     buttonVariants({variant:"ghost"}), 
                //     "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
                //     isActive && "text-foreground",
                // )}
                className={`w-full font-medium justify-start ${isActive ? "text-app" : "text-gray-400"} hover:text-foreground`}
                onClick={() => {
                    if(onClick) onClick();
                }}
            >
                {label}
            </Link>
            {/* {
                isActive && (
                    <div className="absolute -bottom-[20px] left-1/2 hidden h-[5px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
                )
            } */}
        </div>
    )
}

export default Navbar;