import UserInterface from "@/interfaces/user";

export const UPDATE_USER_DATA = '@account/UPDATE_USER_DATA';
export const USER_IS_UPDATING = '@account/USER_IS_UPDATING';


export function updateUserData(user:UserInterface) {
    return {type: UPDATE_USER_DATA, payload: user}
}


export function userIsUpdating(updating:boolean) {
    return {type: USER_IS_UPDATING, payload: updating}
}