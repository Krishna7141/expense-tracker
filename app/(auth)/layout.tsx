import React, { ReactNode } from "react";
import LogoImg from "@/assets/Logo.png";
import Image from "next/image";

function layout({children}:{children:ReactNode}) {
	return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <div className="flex justify-center">
                    <Image src={LogoImg} className="h-20 w-fit mb-5" alt="logo"/>
                    {/* <p>ashFlow</p> */}
                </div>
                {children}
            </div>
        </div>
    );
}

export default layout;