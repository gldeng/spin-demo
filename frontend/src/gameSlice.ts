import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total_steps: 0,
  current_position: 0,
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
    },
  });
  

export const { setTotalSteps, setCurrentPosition } = gameSlice.actions;
export default gameSlice.reducer;