import prisma from "../../../../prisma/client";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginOneApi } from "@/app/httpservices/axios";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (user) {
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) return null;
          const token = jwt.sign(
            {
              userId: user.id,
              role: user.role,
              email: user.email,
            },
            process.env.NEXT_JWT_SECRETE!,
            { expiresIn: "1d" }
          );
          loginOneApi.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          return { user, token };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt(params: any) {
      const { token, user }: any = params;
      if (user) {
        const customUser = user as unknown as any;
        token.accessToken = customUser?.token;
        token.role = customUser?.user?.role;
        token.id = customUser?.user?.id;
        token.firstname = customUser?.user?.firstName;
        token.lastname = customUser?.user?.lastName;
        token.phone = customUser?.user?.phone;
        token.workCountry = customUser?.user?.workCountry;
      }
      return token;
    },
    async session(params: any) {
      const { session, token } = params;
      const customSession: any = {
        accessToken: token.accessToken,
        role: token.role,
        id: token.id,
        status: token.status,
        email: token.email,
        firstname: token.firstname,
        lastname: token.lastname,
        phone: token.phone,
        workCountry: token.workCountry,
      };
      return { ...session, ...customSession };
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
