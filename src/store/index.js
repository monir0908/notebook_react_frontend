// import { createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

// const store = createStore(reducer);

// // const persister = 'Free';

// export { store };

export const store = configureStore({
    reducer: reducer
});
