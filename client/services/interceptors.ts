import { COOKIE_AUTH_TOKEN } from "@/utils/cookies";
import type { NextApiRequest, NextApiResponse } from "next";
import {getCookie} from 'cookies-next'

export default (endpoint:string, options?:any, req?:NextApiRequest, res?:NextApiResponse) => {

    const token:any = getCookie(COOKIE_AUTH_TOKEN, {req, res});

    let defaultOptions:any = {
        method: options.method,
        headers: {
            'Origin': 'myBlog.md',
            'Referer': 'myBlog.md',
            'Content-Type': 'application/json',
        }
    };

    if (options.body) {
        defaultOptions.body = options.body
    }

    if (endpoint.match('/next-php-blog/server/controllers/')) {
        defaultOptions.headers = {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    }

    if (typeof token === "string") {
        defaultOptions.headers = {...defaultOptions.headers, ...{'Authorization': `Bearer ${token}`}};
    }


    return fetch('http://localhost' + endpoint, defaultOptions)
}

