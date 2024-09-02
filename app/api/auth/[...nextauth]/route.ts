import { verifyPassword } from "@/lib/Auth";
import { connectToMongoDB } from "@/lib/db";
import User from "@/models/User";
// import NextAuth from "next-auth";
import NextAuth, { DefaultSession , User as NextAuthUser, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

import CredentialsProvider from "next-auth/providers/credentials";
interface User {
  id: string;
  email: string;
  role: string;
  profileImage?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      role?: string | null;
      user_id?: string | null;
      profileImage?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string | null;
    user_id?: string | null;
    profileImage?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    user_id?: string | null;
    profileImage?: string | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    user_id?: string | null;
    profileImage?: string | null;
  }
}
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // Define the fields expected in the login form
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        // Establish a database connection
        const client = await connectToMongoDB();  
        try {
          // Find user by email
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            throw new Error('No user found with this email');
          }
  
          // Verify password
          const isValid = await verifyPassword( credentials?.password, user.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }
  
          // Return user object with id, email, role, and profile image
          return { id: user._id.toString(), email: user.email, role: user.userType, user_id: user._id.toString(), profileImage: user.profileImage };
        } finally {
          // Close the database connection
          // await client.close();
        }
      }
    })
  ],
  session: {
    strategy: 'jwt', // Updated to 'jwt' to align with the rest of your configuration
  },
  pages: {
    signIn: '/', // Redirect to a custom sign-in page
  },
  callbacks: {
    async session({ session, token }) {
      // Add role and profile image to the session object
      if (token && session.user) {
        session.user.role = token.role ?? null;
        session.user.user_id = token.user_id ?? null;
        session.user.profileImage = token.profileImage ?? null;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add role and profile image to the JWT token
      if (user) {
        token.role = user.role;
        token.user_id = user.user_id;
        token.profileImage = user.profileImage;
      }
      return token;
    },
  }
});

export { handler as GET, handler as POST };
