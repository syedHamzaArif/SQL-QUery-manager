import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type darkModeTheme = {
  theme: string;
};

const initialState: darkModeTheme = {
  theme: "dark",
};

const darkMode = createSlice({
  name: "darkmode",
  initialState,
  reducers: {
    setDarkModeTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
  },
});

export const { setDarkModeTheme } = darkMode.actions;
export default darkMode.reducer;
