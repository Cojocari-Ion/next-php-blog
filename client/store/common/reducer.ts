import * as actionTypes from './actions';

interface initialValues {
    commentText: string
}

const initialState: initialValues = {
    commentText: '',
}

const reducer = (state = initialState, action:any) => {
    switch (action.type) {
        case actionTypes.SET_COMMENT_TEXT:
            return {...state, commentText: action.payload};
            
        default: return state 
    }
}

export default reducer