import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AccountState = {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  isActive: boolean | null;
};

const initialState: AccountState = {
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  isActive: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setCustomerId: (state, action: PayloadAction<string>) => {
      state.stripeCustomerId = action.payload;
    },
    setSubscriptionId: (state, action: PayloadAction<string>) => {
      state.stripeSubscriptionId = action.payload;
    },
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
  }
});

export const { setCustomerId, setSubscriptionId, setIsActive } = accountSlice.actions;
export default accountSlice.reducer;