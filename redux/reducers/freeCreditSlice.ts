import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FreeCreditsState = {
  explainSqlCredits: number;
};

const initialState: FreeCreditsState = {
  explainSqlCredits: 3,
};

const freeCreditsSlice = createSlice({
  name: 'freeCredits',
  initialState,
  reducers: {
    setExplainSqlCredit: (state, action: PayloadAction<number>) => {
      state.explainSqlCredits = action.payload;
    },
  }
});

export const { setExplainSqlCredit } = freeCreditsSlice.actions;
export default freeCreditsSlice.reducer;