import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AElf from 'aelf-sdk';

// create a new instance of AElf
const aelf = new AElf(new AElf.providers.HttpProvider('http://localhost:8000'));

export const submitGame = createAsyncThunk('contract/submitGame', async (proofInput) => {
    const wallet = AElf.wallet.getWalletByPrivateKey('1111111111111111111111111111111111111111111111111111111111111111');
    const contractAddress = 'vbdmQxUDQwaw3t9VFeYEKLeYTvhdXNZf35mbhXM59dnUFbSW4';
    const gameContract = await aelf.chain.contractAt(contractAddress, wallet);
});


const initialState = {
    submitted: false
};

const submissionSlice = createSlice({
    name: 'submission',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(submitGame.fulfilled, (state, action) => {
            state.submitted = true;
        });
    },
});

export default submissionSlice.reducer;