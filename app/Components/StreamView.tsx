"use client";
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Share2 } from "lucide-react"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

const REFRESH_INTERVAL_MS=10*1000;
const StreamView:React.FC<{creatorId:string}>=({creatorId})=>{
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [spotifyUrl, setSpotifyUrl] = useState("")
    
    const currentSong = {
      title: "Current Song Title",
      thumbnail: "https://placehold.co/600x400",
    }
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
    
    
    const [songs, setSongs] = useState<Stream[]>([])
    const [loading,setLoading]=useState(false);
    
  
  
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
      setSongs(responseData.data);
  
    }
    const upVote=async(id:string,isUpvote:boolean)=>{
      try{
        const data=await fetch(`/api/streams/${isUpvote?'upvotes':'downvotes'}`,{
          method:'POST',
          body:JSON.stringify({
            streamId:id
  
          })
        })
        if(!data.ok){
          return;
  
        }
        const newCountData=songs.sort((a,b)=>{
          return a.upvotes-b.upvotes

        });
        const idx=songs.findIndex((song)=>{
          return song.id===id;


        })
        newCountData[idx].isVoted=!newCountData[idx].isVoted as boolean;
        setSongs(newCountData);
      }
      catch(err){
  
      }
    }
 
    const handleAddToQueue=async()=>{
          setLoading(false);
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
      

    }
    useEffect(()=>{
      const interval=setInterval(()=>{
          refreshFeeds();
  
  
      },REFRESH_INTERVAL_MS);
  
  
    },[]);
  
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-pink-100 to-pink-200">
        <div className="flex-grow max-w-4xl mx-auto p-6 space-y-6 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-pink-800">Muzer</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-pink-400 text-pink-700 hover:bg-pink-100"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
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
            <Button className="bg-pink-500 hover:bg-pink-600 text-white" onClick={()=>{
              handleAddToQueue()
            }}>Add to Queue</Button>
          </div>
        

          
          <Card className="bg-white/70 border-pink-300">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-pink-800">Now Playing</h2>
              <div className="flex items-center gap-4">
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <div>
                  <p className="font-medium text-pink-900">{currentSong.title}</p>
                  <Button variant="outline" size="sm" className="mt-2 border-pink-400 text-pink-700 hover:bg-pink-100">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </div>
              </div>
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
                        <ThumbsDown className="w-4 h-4" />
                      </Button> :         <Button
                        variant="outline"
                        size="sm"
                        onClick={() => upVote(song.id,true)}
                        className="border-pink-400 text-pink-700 hover:bg-pink-100"
                      >
                        <ThumbsUp className="w-4 h-4" />
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