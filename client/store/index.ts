import account from './account/reducer';
import common from './common/reducer';
import {createStore, combineReducers } from 'redux';


const reducer = combineReducers({
    account,
    common
})

const store = createStore(reducer);

export default store