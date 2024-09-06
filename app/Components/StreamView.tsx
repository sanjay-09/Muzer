"use client";
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Share2, LogOut, MoveUp, MoveDown } from "lucide-react"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { signOut } from "next-auth/react";
type upVotes={
  id:string,
  userId:string,
  streamId:string
}
type Stream = {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  played: boolean;
  createAt: Date;
  upvotes: number;
  userId: string;
  isVoted:boolean
 
};

const REFRESH_INTERVAL_MS=10*1000;
const StreamView:React.FC<{creatorId:string}>=({creatorId})=>{
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [spotifyUrl, setSpotifyUrl] = useState("")
    const [currentSong,setCurrentSong]=useState<Stream | null>(null);
  
    const [songs, setSongs] = useState<Stream[]>([])
    const [loading,setLoading]=useState(false);
    
    console.log("currentSong",currentSong);
  
  
    const handleShare = async() => {
      await navigator.clipboard.writeText(`http://localhost:3000/creator/${creatorId}`);
      alert("copied to the clipboard");
    }
  
    const refreshFeeds=async()=>{
      const data=await fetch(`/api/streams?creatorId=${creatorId}`);
      if(!data.ok){
          return;
      }
      const responseData=await data.json();
      console.log("response",responseData);
      const updatedData=responseData.data.sort((a:Stream,b:Stream)=>{
        return b.upvotes-a.upvotes;
      })
      setSongs(updatedData);
      setCurrentSong(responseData.activeStream?.stream)
  
    }
    const upVote=async(id:string,isUpvote:boolean)=>{
      try{
        const idx=songs.findIndex((song)=>{
          return song.id===id;


        })
        const newCountData=[...songs];
        newCountData[idx].isVoted=!newCountData[idx].isVoted as boolean;
       if(isUpvote){
        newCountData[idx].upvotes++;
       }
      else{
        newCountData[idx].upvotes--;

      }
        const newCountDataUpdated=newCountData.sort((a,b)=>{
          return b.upvotes-a.upvotes

        });
        console.log(newCountDataUpdated);
        
        setSongs(newCountDataUpdated);
        console.log('data updated');

        const data=await fetch(`/api/streams/${isUpvote?'upvotes':'downvotes'}`,{
          method:'POST',
          body:JSON.stringify({
            streamId:id
  
          })
        })
       
        if(!data.ok){
          return;
  
        }
        
      }
      catch(err){
  
      }
    }
 
    const handleAddToQueue=async()=>{
          setLoading(true);
         const response=await fetch('api/streams',{
          method:'POST',
          body:JSON.stringify({
            creatorId:creatorId,
            url:youtubeUrl
          })
         })
         if(!response.ok){
          return;
          
         }
         const data=await response.json();
         console.log('addTOQUeue',data);
         setYoutubeUrl("");
         setLoading(false);
      

    }
    useEffect(()=>{
      const interval=setInterval(()=>{
          refreshFeeds();
  
  
      },REFRESH_INTERVAL_MS);
  
  
    },[]);
    const playNextHandler=async()=>{
      const response=await fetch('/api/streams/next');
      const data=await response.json();
      setCurrentSong(data.stream);
      

    }
  
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-pink-100 to-pink-200">
        <div className="flex-grow max-w-4xl mx-auto p-6 space-y-6 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-pink-800">Muzer</h1>
            <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-pink-400 text-pink-700 hover:bg-pink-100"
            >
              
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={()=>{
                signOut();
              }}
              className="border-pink-400 text-pink-700 hover:bg-pink-100"
            >
              <LogOut className="w-4 h-4 mr-2"/>
              
              SignOut
            </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="bg-white/50 border-pink-300"
            />
            <Input
              placeholder="Enter Spotify URL"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              className="bg-white/50 border-pink-300"
            />
          {
            loading ?  <Button className="bg-pink-500 hover:bg-pink-600 text-white">Adding to the Queue</Button>: <Button className="bg-pink-500 hover:bg-pink-600 text-white" onClick={()=>{
              handleAddToQueue()
            }}>Add to Queue</Button>
          }
          </div>
          
          {
            currentSong && (<>
            <Card className="bg-white/70 border-pink-300">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-pink-800">Now Playing</h2>
              <div className="flex items-center gap-4 w-full">
              <iframe  src={`http://www.youtube.com/embed/${'NWnBxQjssvQ&t'}?autoplay=1`} allow='autoplay' ></iframe>
              </div>
            </CardContent>
            </Card>
            </>)
          }
        
          <Card className="bg-white/70 border-pink-300">
            <CardContent className="p-4">
              <Button className="w-full" onClick={playNextHandler}>Play Next</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 border-pink-300">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-2 text-pink-800">Up Next</h2>
              <ul className="space-y-4">
                {songs?.map((song) => (
                  <li key={song.id} className="flex items-center gap-4 bg-white/50 p-2 rounded-lg">
                    <img
                      src={song.smallImg}
                      alt={song.title}
                      className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-pink-900">{song.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {
                        song?.isVoted ? <Button
                        variant="outline"
                        size="sm"
                        onClick={() => upVote(song.id,false)}
                        className="border-pink-400 text-pink-700 hover:bg-pink-100"
                      >
                        
                        <MoveUp className="w-4 h-4" />
                      </Button> :         <Button
                        variant="outline"
                        size="sm"
                        onClick={() => upVote(song.id,true)}
                        className="border-pink-400 text-pink-700 hover:bg-pink-100"
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                    
                      }
                        <span className="text-pink-800 w-8 text-center">{song?.upvotes}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )




}
export default  StreamView;