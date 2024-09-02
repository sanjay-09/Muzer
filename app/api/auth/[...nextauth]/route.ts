import { primsaClient } from "@/app/lib/db";

import GoogleProvider from "next-auth/providers/google";
import NextAuth, {type DefaultSession } from "next-auth"
declare module "next-auth" {
  interface Session {
      user: {
          id: string
      } & DefaultSession["user"]
  }
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
      ],
      secret: process.env.NEXTAUTH_SECRET,
      callbacks:{
        async signIn(params){
          if(!params.user.email){
            return false;
          }
          
          try{
            await primsaClient.user.create({
              data:{
                email:params.user.email,
                provider:'Google'
              }
            })

          }
          catch(err){
            return false;

          }
          return true;
        },
        async session({ session}) {
          const dbUser = await primsaClient.user.findUnique({
            where: {
                email: session.user?.email ?? ""
            }
        })
        if (!dbUser) {
            return session;
        }
        return {
            ...session, 
            user: {
                id: dbUser.id
            }
        }
        },
  }
      })


export { handler as GET, handler as POST }