import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { createRedisInstance } from "./redis";
import { VerifyTokenResult, NextJWT, VerifyTokenErrors } from '../types/user';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const verifyToken = async ( req: NextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req }) as NextJWT;
    const serverSession = await getServerSession(req, res, authOptions);
    
    if (!token || !serverSession) {
        return getErrorMessage(VerifyTokenErrors.SESSION_EXPIRED)
    }

    const { email, opaqueToken }: VerifyTokenResult = token.user;

    const redis = createRedisInstance();

    let opaqueTokenExists = await redis.exists(email as string);

    if (!opaqueTokenExists) {
        return getErrorMessage(VerifyTokenErrors.UNAUTHORIZED)
    }

    let cachedOpaqueToken = await redis.get(email as string);
    
    if (cachedOpaqueToken) {
        cachedOpaqueToken = cachedOpaqueToken.replace(/^"|"$/g, '');
    }

    if (cachedOpaqueToken !== opaqueToken) {
        return getErrorMessage(VerifyTokenErrors.TOKEN_MISMATCH)
    }

    return {
        cachedOpaqueToken,
        email
    };
}

const getErrorMessage = (message: VerifyTokenErrors, code = 403,) => {
    return { 
        error: { 
            code,
            message
        }
    }
}