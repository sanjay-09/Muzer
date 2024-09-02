"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StreamView from "../Components/StreamView";

const REFRESH_INTERVAL_MS=10*1000;

export default function Component() {
  const session=useSession();
  const router=useRouter();
  if(!session?.data?.user.id){
     return router.push("/");
        
  }
  return <StreamView creatorId={session?.data.user.id}/>
  
}