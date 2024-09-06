"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StreamView from "../Components/StreamView";

const REFRESH_INTERVAL_MS=10*1000;

export default function Component() {
  const session=useSession();
  console.log("dash",session);
  const router=useRouter();
  const id=sessionStorage.getItem('creatorId');
  if(!session?.data?.user.id){
     return router.push("/");
        
  }
  return <StreamView creatorId={id?id:session?.data.user.id}/>
  
}