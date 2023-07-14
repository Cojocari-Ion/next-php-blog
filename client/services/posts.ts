import ServiceResponse from "@/interfaces/serviceResponse";
import UserInterface from "@/interfaces/user";
import {getAuthToken, setAuthToken, deleteAuthToken} from '../utils/cookies'
import { use } from "react";

let endpoint:string = process.env.NODE_ENV !== 'production' ? 'http://localhost/next-php-blog/server/controllers/' : '';

export const addPost = async (title: string, content: string, image: string, userID: number) => {
    let response:ServiceResponse = {
        error: false,
    }

    const post = {
        title:title,
        content:content,
        image:image,
        userID: userID
    }

    try {
        const req = await fetch(endpoint + 'addPost.php', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(post),

        })

        const body = await req.json();

        if(!body.post.user){
            response.error = true;
            response.message = 'Unknown error asd'
            return response

        } else if (body.post.user) {
            response.error = false;
            response.message = body.message
            response.response = body.post
        }

        // response.response = body

        return response


    } catch(error){
        response.error = true;
        response.message = 'unknown error'

        return response
    }

}
export const likePost = async () => {
    let response:ServiceResponse = {
        error: false,
    }

    const info = {
        postId: "235",
        userId: "50",
      };

    try {
        const req = await fetch(endpoint + 'addRemoveLike.php', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(info),
        })

        const body = await req.json();

        response.response = body
    
        return response


    } catch(error){
        response.error = true;
        response.message = 'unknown error'

        return response
    }

}

