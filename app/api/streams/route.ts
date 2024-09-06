import { primsaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth/next";

const streamCreateSchema=z.object({
    creatorId:z.string(),
    url:z.string()
})
const YTRegx=/^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
export const POST=async(req:NextRequest)=>{
    try{
        const data=streamCreateSchema.parse(await req.json());
        const isYt=data.url.match(YTRegx)
        if(!isYt){
            return NextResponse.json({
                message:'url error'
            },{
                status:401
            })
        }
       
        const extractedId=data.url.split('?v=')[1];
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const title=res.title;
        const thumbnails=res.thumbnail.thumbnails;
        thumbnails.sort((a:{width:number},b:{
            width:number
        })=>{
            return a.width-b.width
        })
        console.log(thumbnails);
       const streamData= await primsaClient.stream.create({
            data:{
                userId:data.creatorId,
                url:data.url,
                type:'Youtube',
                extractedId:extractedId,
                title:title ?? 'cant find video',
                smallImg:thumbnails.length>1?thumbnails[thumbnails.length-2].url:thumbnails[thumbnails.length-1].url,
                bigImg:thumbnails[thumbnails.length-1].url

            }
        })
        return NextResponse.json({
            message:'created the stream',
            data:streamData
        },{
            status:200
        })

    }

    catch(err){
        console.log(err);
        return NextResponse.json({
            message:'validation fail while adding the stream'
        },{
            status:411
        })

    }
}
export const GET=async(req:NextRequest)=>{
    const { searchParams } = new URL(req.url);
    const creatorid=searchParams.get('creatorId');
    const session = await getServerSession();
   
    const user=await primsaClient.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
    })
   
    if(!user){
        return NextResponse.json({
            message:'Unauthenticated'
        },{
            status:401
        })
    }
 
    if(!creatorid){
        return NextResponse.json({
            message:'creator Id is not present',
        
        },{
            status:400
        })
        
    }
    
    const [userStreams,activeStream]=[await primsaClient.stream.findMany({
        where:{
            userId:creatorid,
            played:false
        },
        include: {
            _count:{
                select:{
                    upvotes:true
                }
            },
            upvotes:{
                where:{
                    userId:user.id
                }
            }
          },
    }),await primsaClient.currentStream.findFirst({
        where:{
            userId:creatorid
        },
        include:{
            stream:true
        }
    })] 
    console.log("active",activeStream);  
  
    const data=userStreams.map(({_count,upvotes,...rest})=>{
        return {
            ...rest,
            upvotes:_count.upvotes,
            isVoted:upvotes.length>0?true:false
        }

    })
    
    
    return NextResponse.json({
        message:'OKAY',
        data:data,
        activeStream
    },{
        status:200
    })
}