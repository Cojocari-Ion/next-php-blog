import ServiceResponse from "@/interfaces/serviceResponse";
import UserInterface from "@/interfaces/user";
import {getAuthToken, setAuthToken, deleteAuthToken} from '../utils/cookies'
import fetchDatas from './interceptors';


let endpoint:string = process.env.NODE_ENV !== 'production' ? 'http://localhost/next-php-blog/server/controllers/' : '';

const toogleFetch = (url:string, params:any) => {
    return fetchDatas(url, params)
}

export const fetchPublicUser = async (id:number) => {
    let response:ServiceResponse = {
        error: false,
    }

    const data = {
        id: id
    }

    try {

        const req = await fetch(endpoint +'fetchUser.php', {
            method: 'POST',
            body: JSON.stringify(data),
        })

        const body = await req.json();

        if(!body.user){
            response.error = true;
            response.message = 'Unknown error'
            return response

        } else if (body.user) {
            response.error = false;
            response.message = body.message
            response.response = body.user
        }

        // response.response = body

        return response

    } catch(e){

    }
}

export const signUpService  = async (user:string, email:string, pass:string, image?:string) => {

    let response:ServiceResponse = {
        error: false,
    }

    const userData = image? {
        userName: user,
        userEmail: email,
        userPwd: pass,
        image: image
    } : {
        userName: user,
        userEmail: email,
        userPwd: pass,
    }

    try {
        // console.log(userData)
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

export const fetchPopularUsers = async (): Promise<ServiceResponse> => {

    let response: ServiceResponse = {
        error: false
    }

    try {

        const request = await fetch(endpoint + 'fetchPopularUsers.php', {
            method: 'GET',
        });

        const body = await request.json()

        if(Array.isArray(body.users)){
            response.response = body.users
        }

        return response

    } catch(error) {
        response.error = true;
        response.message = 'unknown error'

        return response
    }
}

