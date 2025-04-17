"use client";
import React from "react";
import LogoImg from "@/assets/Logo.png";
import Image from "next/image";

function Logo() {
	return (
        <div>
            <a href="/" className="flex items-center gap-0">
                <Image src={LogoImg} className="/*hidden md:block*/ h-[35px] md:h-[40px] w-fit" alt="logo"/>
                <p className="text-xl md:text-2xl font-semibold text-app">ashFlow</p>
            </a>
        </div>
    );
}

export default Logo;