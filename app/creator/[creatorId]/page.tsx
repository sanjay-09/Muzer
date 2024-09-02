"use client";
import StreamView from "@/app/Components/StreamView";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const page=({params}:{
    params:{
        creatorId:string
    }
})=>{
   const session=useSession();
   const router=useRouter();
   if(!session.data?.user.id){
    return router.push('/')
   }
   return <StreamView creatorId={params.creatorId}/>
    
}
export default page;