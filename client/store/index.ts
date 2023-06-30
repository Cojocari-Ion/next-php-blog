import account from './account/reducer';
import {createStore, combineReducers } from 'redux';


const reducer = combineReducers({
    account,
})

const store = createStore(reducer);

export default store