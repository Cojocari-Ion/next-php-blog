import  {setCookie, getCookie, deleteCookie} from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';

export const COOKIE_AUTH_TOKEN:string = 'user_temp_token';

export function setAuthToken(token: string, req?:NextApiRequest, res?:NextApiResponse): void {
    setCookie(COOKIE_AUTH_TOKEN, token, {path: '/', sameSite: 'none', secure: true, req, res});
}

export function getAuthToken(req?:NextApiRequest, res?:NextApiResponse):string {
    const token = getCookie(COOKIE_AUTH_TOKEN, {path: '/', req, res});
    // console.log('getAuthToken', token);
    return typeof token === "string" ? token.toString() : '';
}

export function deleteAuthToken(): void {
    deleteCookie(COOKIE_AUTH_TOKEN);
}