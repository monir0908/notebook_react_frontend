import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import authSlice from './features/auth/authSlice';
import collectionSlice from './features/collection/collectionSlice';
import documentSlice from './features/document/documentSlice';
import headerSlice from './features/header/headerSlice';
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    auth: authSlice,
    collection: collectionSlice,
    document: documentSlice,
    header: headerSlice
});

export default reducer;
