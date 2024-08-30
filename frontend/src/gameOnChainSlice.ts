import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total_steps: '',
  current_position: ''
};

const gameOnChainSlice = createSlice({
    name: 'gameOnChain',
    initialState,
    reducers: {
      setOnChainTotalSteps: (state, action) => {
        state.total_steps = action.payload;
      },
      setOnChainCurrentPosition: (state, action) => {
        state.current_position = action.payload;
      },
    },
  });
  

export const { setOnChainTotalSteps, setOnChainCurrentPosition } = gameOnChainSlice.actions;
export default gameOnChainSlice.reducer;