import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total_steps: '',
  current_position: '',
  onChainStateLoaded: false,
  gameInitialized: false,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
      setTotalSteps: (state, action) => {
        state.total_steps = action.payload;
      },
      setCurrentPosition: (state, action) => {
        state.current_position = action.payload;
      },
      setOnChainStateLoaded: (state, action) => {
        state.onChainStateLoaded = action.payload;
      },
      setGameInitialized: (state, action) => {
        state.gameInitialized = action.payload;
      },
    },
  });
  

export const { setTotalSteps, setCurrentPosition, setOnChainStateLoaded, setGameInitialized } = gameSlice.actions;
export default gameSlice.reducer;