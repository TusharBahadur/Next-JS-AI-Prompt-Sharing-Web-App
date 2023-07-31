import NextAuth from 'next-auth';
import { connectToDB } from "@utils/database";
import User from '@models/user';
import GoogleProvider from 'next-auth/providers/google';

console.log({
  clientId: "662911963931-t260evukaiu9490fc76am5bqurd8nf8g.apps.googleusercontent.com",
      clientSecret: "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",
})
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: "662911963931-t260evukaiu9490fc76am5bqurd8nf8g.apps.googleusercontent.com",
      clientSecret: "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",
    })
  ],
  callbacks:{
    async session({session}){
      const sessionUser = await User.findOne({
        email:session.user.email
      })
      session.user.id = sessionUser._id.toString(); 
      return session;
      },
      async signIn({account, profile, user, credentials}){
        try{
          await connectToDB();
          const userExists = await User.findOne({
            email:profile.email
          })
          if(!userExists){
            await User.create({
              email : profile.email,
              username: profile.name.replace(" ","").toLowerCase(),
              image: profile.picture
            })
          }
      return true;
        } catch(error){
          console.log(error);
          return false;
      
        }
      
      },
  }

}

)

export {handler as GET, handler as POST};