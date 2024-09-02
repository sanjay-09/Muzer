"use client";
import { SessionProvider } from "next-auth/react"
import React from "react"
type props={
    children:React.ReactNode
}

const Providers:React.FC<props>=({children})=>{
    return(
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
export default Providers;