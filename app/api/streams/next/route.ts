import { primsaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";

export const GET=async()=>{
    const session=await getServerSession();
    const isUserPresent=await primsaClient.user.findFirst({
        where:{
            email:session?.user.email ?? ""
        }
    });
    if(!isUserPresent){
        return NextResponse.json({
            message:'User unauthenticated'
        },{
            status:500
        });
    }
    const mostUpvotedStream=await primsaClient.stream.findFirst({
        where:{
            userId:session?.user.id,
            played:false
        },
        orderBy:{
            upvotes:{
                _count:'desc'
            }
        }
    })
    console.log(mostUpvotedStream);
    const p1=await primsaClient.currentStream.upsert({
        where:{
            userId:isUserPresent.id,
           
        },
        update: {
           StreamId:mostUpvotedStream?.id
          },
          create: {
            userId:isUserPresent.id,
            StreamId:mostUpvotedStream?.id

          },
    })
    const p2=await primsaClient.stream.update({
        where:{
            id:mostUpvotedStream?.id,
           
        },
        data:{
            played:true
        }
    });
    
    await Promise.all([p1,p2]);
    return NextResponse.json({
        stream:mostUpvotedStream
    })

}