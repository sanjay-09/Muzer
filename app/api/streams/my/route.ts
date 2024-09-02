import { primsaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";

export const GET=async()=>{
    try{
        const session=await getServerSession();
        const user=await primsaClient.user.findFirst({
            where:{
                email:session?.user?.email ?? ""
            }
        })
     
        if(!user){
            return NextResponse.json({
                message:'Unauthenticated'
            },{
                status:403
            })
        }
        console.log("user",user.id);
        const userStreams=await primsaClient.stream.findMany({
            where:{
                userId:user.id
            },
            include: {
                _count:{
                    select:{
                        upvotes:true
                    }
                }
              },
        })   
       
        const data=userStreams.map(({_count,...rest})=>{
            return {
                ...rest,
                upvotes:_count.upvotes
            }

        })
        
        console.log("data",data);

        return NextResponse.json({
            message:'OKAY',
            data:data
        },{
            status:200
        })

    }
    catch(err){
        return NextResponse.json({
            message:'error'
        },{
            status:500
        })

    }
}