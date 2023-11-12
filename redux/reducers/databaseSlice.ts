import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DB, Table, Query } from "../../utils/types";

export type DbState = {
  map(arg0: (q: any, i: any) => JSX.Element): import("react").ReactNode;
  length: number;
  isNew: boolean;
  current: DB | null;
  all: DB[];
  tables: Table[];
  queriesData: Query[];
};

const dbSlice = createSlice({
  name: "dbDataState",

  initialState: {
    isNew: false,
    current: null,
    all: [] as DB[],
    tables: [] as Table[],
    queriesData: [] as Query[],
  } as DbState,

  reducers: {
    setCurrent: (state, action: PayloadAction<string>) => {
      state.current = state.all.find((db) => db.id === action.payload) || null;
    },
    setIsNew: (state, action: PayloadAction<boolean>) => {
      state.isNew = action.payload;
    },

    setAllDb: (state, action: PayloadAction<DB[]>) => {
      state.all = action.payload;
    },

    addDB: (state, action: PayloadAction<DB>) => {
      state.all = [...state.all, action.payload];
      state.current = action.payload;
    },
    updateDB: (state, action: PayloadAction<DB>) => {
      state.current = action.payload;
      const index = state.all.findIndex((t) => t.id === action.payload.id);
      state.all.splice(index, 1, action.payload);
    },
    deleteDB: (state, action: PayloadAction<string>) => {
      state.all = state.all.filter((db) => db.id !== action.payload);
      state.current = state.all[0];
    },

    setTables: (state, action: PayloadAction<Table[]>) => {
      state.tables = action.payload;
    },

    addTable: (state, action: PayloadAction<Omit<Table, "index">>) => {
      state.tables = [
        ...state.tables,
        { ...action.payload, index: state.tables.length },
      ];
    },

    appendTables: (state, action: PayloadAction<Table[]>) => {
      const updatedTables = state.tables.concat(action.payload);
      state.tables = updatedTables;
    },
    resetTables: (state) => {
      state.tables = [];
    },

    updateTable: (state, action: PayloadAction<Table>) => {
      const updatedTables = state.tables.map((table) => {
        if (table.id === action.payload.id) {
          return action.payload;
        }
        return table;
      });
      state.tables = updatedTables;
    },

    addQuery: (state, action: PayloadAction<Query>) => {
      state.queriesData = [{ ...action.payload }, ...state.queriesData];
    },

    setQuery: (state, action: PayloadAction<any>) => {
      state.queriesData = [...state.queriesData, ...action.payload];
    },
    resetQuery: (state, action: PayloadAction<any>) => {
      state.queriesData = action.payload;
    },

    setExplain: (state, action: PayloadAction<any>) => {
      state.queriesData = [...state.queriesData, ...action.payload];
    },
    resetExplain: (state, action: PayloadAction<any>) => {
      state.queriesData = action.payload;
    },

    deleteTable: (state, action: PayloadAction<string>) => {
      state.tables = state.tables.filter((t) => t.id !== action.payload);
    },

    addFeedback: (
      state,
      action: PayloadAction<{ queryId: string; isCorrect: boolean }>
    ) => {
      const { queryId, isCorrect } = action.payload;
      if (state.current) {
        const queryIndex = state.queriesData.findIndex((q) => q.id === queryId);
        const updatedQuery = {
          ...state.queriesData[queryIndex],
          isCorrect,
        };

        state.queriesData = [
          ...state.queriesData.slice(0, queryIndex),
          updatedQuery,
          ...state.queriesData.slice(queryIndex + 1),
        ];
      }
    },
  },
});

export const {
  setCurrent,
  setIsNew,
  setAllDb,
  addDB,
  updateDB,
  deleteDB,
  addTable,
  appendTables,
  updateTable,
  deleteTable,
  setTables,
  setQuery,
  addQuery,
  addFeedback,
  resetQuery,
  resetTables,
  resetExplain,
  setExplain,
} = dbSlice.actions;
export default dbSlice.reducer;
