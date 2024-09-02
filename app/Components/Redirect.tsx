"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirect=()=>{
    const session=useSession();
    const router=useRouter();
    console.log('session',session);
    useEffect(()=>{
        if(session.data?.user){
            router.push('/dashboard');
        
        }
        
    },[session]);

    return(
        <div>

        </div>
    )

}
export default Redirect;