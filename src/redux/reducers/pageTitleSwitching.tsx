import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface pageTitleProps {
  pageTitle: string;
  recordFiltered?: number | string;
}

const initialState: pageTitleProps = {
  pageTitle: "",
  recordFiltered: "",
};

export const pageTitleGenerator = createSlice({
  name: "pageTitle",
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        pageTitle: action.payload,
      };
    },
    setRecordFiltered: (state, action: PayloadAction<string|number>) => {
      return {
        ...state,
        recordFiltered: action.payload,
      };
    },
  },
});

export const { setPageTitle, setRecordFiltered } = pageTitleGenerator.actions;
export default pageTitleGenerator.reducer;
