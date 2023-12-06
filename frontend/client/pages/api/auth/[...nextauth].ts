import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createRedisInstance } from "@/services/redis";
import { httpClientApi } from "@/services/httpClientApi";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // maxAge: 600 // seconds
    maxAge: 12 * 60 * 60 // 12 hours
  },
  useSecureCookies: false,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},

      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const body = JSON.stringify({
          email: 'webi.aleks@gmail.com',
          password: 'test123'
        });
        const headers = {
          "Content-Type": "application/json"
        }

        const method = 'POST'
        let getToken = await fetch(`${process.env.HTTP_CLIENT_API_URL}user/login`, { body, headers, method });
        const getTokenResult = await getToken.json();

        if (!getTokenResult || getTokenResult.error) {
          throw new Error("invalid credentials");
        }

        return getTokenResult;
      }
    }),
  ],
  //secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      if (trigger == 'update') {
        let refreshResult = await refreshAccessToken({token})

        token.user = {
          ...refreshResult
        }
        
        return token;
      }

      user && (token.user = user);

      return token
    },
    async session({ session, user, token }: any) {
      return session
    },
  },
  events: {
    async signOut(message) { 
      console.log('signout--', message)
    },
    async session(message) { 
      console.log('session message--', message)
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

async function refreshAccessToken({token}: any) {
  const { email, opaqueToken } = token.user
  const refreshTokenKey = email + process.env.AUTH_SECRET;
  const redis = createRedisInstance();

  let refreshToken = await redis.get(refreshTokenKey);

  if (!refreshToken) {
    return { error: true, message: 'Token error' }
  }
  
  refreshToken = refreshToken.replace(/^"|"$/g, '');

  let cachedEmail = await redis.get(refreshToken);

  if (cachedEmail) {
    cachedEmail = cachedEmail.replace(/^"|"$/g, '');
  }

  if (cachedEmail != email) {
    return { error: true, message: 'Mismatch' }
  }

  let refreshTokenParams = JSON.stringify({
    refreshToken,
    email
  });

  let apiResult = await httpClientApi({
    method: 'POST',
    token: opaqueToken,
    path: 'user/refresh',
    params: refreshTokenParams
  })

  console.log('refresh token result -', apiResult)

  return apiResult;
}

export default NextAuth(authOptions);
