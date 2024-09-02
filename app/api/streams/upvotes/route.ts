import { primsaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const UpVoteSchema=z.object({
    streamId:z.string()
})

export const POST=async(req:NextRequest)=>{

        const session=await getServerSession();
    const user=await primsaClient.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
   
    });
    if(!user){
        return NextResponse.json({
            message:'Unauthenticated'
        },{
            status:401
        })
    }
    try{
        const data=await UpVoteSchema.parse(await req.json());
        await primsaClient.upvote.create({
            data:{
                streamId:data.streamId,
                userId:user.id

            }
        })
        return NextResponse.json({
            message:'Upvote done successfully'
        },{
            status:200
        })


    }
    catch(err){
        return NextResponse.json({
            message:'Not able to upvote'
        },{
            status:500
        })

    }


    
    
}