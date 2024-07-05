import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    name: "altcoin",
    link: "https://cointelegraph.com/rss/tag/altcoin",
    checked: false,
  },
  {
    name: "bitcoin",
    link: "https://cointelegraph.com/rss/tag/bitcoin",
    checked: false,
  },
  {
    name: "blockchain",
    link: "https://cointelegraph.com/rss/tag/blockchain",
    checked: false,
  },
  {
    name: "ethereum",
    link: "https://cointelegraph.com/rss/tag/ethereum",
    checked: false,
  },
  {
    name: "litecoin",
    link: "https://cointelegraph.com/rss/tag/litecoin",
    checked: false,
  },
  {
    name: "monero",
    link: "https://cointelegraph.com/rss/tag/monero",
    checked: false,
  },
  {
    name: "regulation",
    link: "https://cointelegraph.com/rss/tag/regulation",
    checked: false,
  },
  {
    name: "analysis",
    link: "https://cointelegraph.com/rss/category/analysis",
    checked: false,
  },
];

export const sourceSlice = createSlice({
  name: "source",
  initialState,
  reducers: {
    setCheckedSource: (state, action) => {
      state.forEach((element) => {
        if (element.name === action.payload.name) {
          element.checked = action.payload.checked;
        }
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCheckedSource } = sourceSlice.actions;

export default sourceSlice.reducer;
