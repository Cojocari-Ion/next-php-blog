import * as actionTypes from './actions';
import UserInterface from '@/interfaces/user';

interface initialValues {
    user?: UserInterface
    updating: boolean
}

const initialState: initialValues = {
    user: undefined,
    updating: false
}

const reducer = (state = initialState, action:any) => {
    switch (action.type) {
        case actionTypes.UPDATE_USER_DATA:
            return {...state, user: action.payload};

        case actionTypes.USER_IS_UPDATING:
            return {...state, updating: action.payload};
        
        default: return state 
    }
}

export default reducer