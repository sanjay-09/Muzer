"use client"
import { Button } from "@/components/ui/button";
import { MusicIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const AppBar=()=>{
    const session=useSession();
    console.log(session);

    return(
        <header className="px-4 lg:px-6 h-14 flex items-center justify-center">
        <div className="container flex items-center justify-between">
          <Link className="flex items-center justify-center" href="#">
            <MusicIcon className="h-6 w-6 text-pink-600" />
            <span className="ml-2 text-2xl font-bold text-pink-700">MeloStream</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            
            {
                session.data?.user ?  <Button className="text-sm font-medium hover:underline underline-offset-4 text-pink-700 bg-white" onClick={()=>{
                    signOut()
                }}>
                SignOut
              </Button> :   <Button className="text-sm font-medium hover:underline underline-offset-4 text-pink-700 bg-white"  onClick={()=>{
                    signIn()
                }}>
                SignIn
              </Button> 
              }

          </nav>
        </div>
      </header>

    )
}
export default AppBar;