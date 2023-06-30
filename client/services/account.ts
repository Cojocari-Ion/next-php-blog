import ServiceResponse from "@/interfaces/serviceResponse";
import UserInterface from "@/interfaces/user";
import {getAuthToken, setAuthToken, deleteAuthToken} from '../utils/cookies'
import { use } from "react";

let endpoint:string = process.env.NODE_ENV !== 'production' ? 'http://localhost/next-php-blog/server/controllers/' : '';


export const signUpService  = async (user:string, email:string, pass:string) => {

    let response:ServiceResponse = {
        error: false,
    }

    const userData = {
        userName: user,
        userEmail: email,
        userPwd: pass,
    }

    try {
        const req = await fetch(endpoint + 'auth.php', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),

        })

        const body = await req.json()

        if (body.user.userName.length) {
            response.error = false;
            response.message = body.message
            response.response = body.user
        }


        return response

    } catch(error) {
        response.error = true;
        response.message = 'unknown error'

        return response
    }

}

export const logInService = async (email: string, pwd: string): Promise<ServiceResponse> => {
    let response: ServiceResponse = {
        error: false
    };

    if(!email.length || !pwd.length) {
        response.error = true;
        response.message = 'complete all fields before submiting!'

        return response
    }

    try {
        const user = {
            userEmail: email,
            userPwd: pwd
        }

        const req = await fetch( endpoint + 'loginUser.php', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })

        const body = await req.json()

        if(body.hasOwnProperty('user')) {
            response.message = 'Success';
            response.response = body.user;
            response.error = false
        } else {
            response.error = true;
            response.message = body.message
        }

        return response

    } catch(err) {
        response.error = true;
        response.message = 'Could not log in'

        return response
    }
}

export const fetchProfile = async (): Promise<ServiceResponse> => {
    let response: ServiceResponse = {
        error: false
    }

    const token:string = getAuthToken();
    console.log('token from services', token)

    if(!token.length) {
        response.error = true;
        response.message = '';

        return response;
    }

    try {

        const request = await fetch(endpoint + 'getUser.php', {
                method: 'post',
                body: JSON.stringify({token: token})
            });

        const body = await request.json()

        // if(body['user'] !== undefined) {
        //     response.error = true;
        //     response.message = body['message'];

        // } else if (body['user']) {
        //     response.error = false;
        //     response.message = body['message']
        //     response.response = body['user']
        // }

        if(body.message){
            response.response = body.user
        }

        return response

    } catch(error) {
        response.error = true;
        response.message = 'unknown error'

        return response
    }
}

