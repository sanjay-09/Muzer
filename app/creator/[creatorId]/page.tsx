"use client";
import StreamView from "@/app/Components/StreamView";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const page=({params}:{
    params:{
        creatorId:string
    }
})=>{
    console.log('creatorId',params.creatorId);
   const session=useSession();
   const router=useRouter();
   if(!session.data?.user.id){
    sessionStorage.setItem('creatorId', params.creatorId);
    return router.push('/')
   }
   return <StreamView creatorId={params.creatorId}/>
    
}
export default page;