// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';

BigInt.prototype.toJSON = function () {
    return this.toString();
};

const store = configureStore({
    devTools: {
        serialize: {
            replacer: (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
        },
    },
    reducer: {
        game: gameReducer,
    },
});

export default store;
