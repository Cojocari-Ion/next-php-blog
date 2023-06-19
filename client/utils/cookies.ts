import  {setCookie} from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';


export const COOKIE_AUTH_TOKEN:string = 'user_temp_token';


export function setAuthToken(token: string, req?:NextApiRequest, res?:NextApiResponse): void {
    setCookie(COOKIE_AUTH_TOKEN, token, {path: '/', req, res});
}