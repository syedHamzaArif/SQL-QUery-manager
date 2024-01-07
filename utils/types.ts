import { FieldValue } from "firebase/firestore";

export interface Query {
  id: string;
  prompt: string;
  response: string;
  operation: string;
  createdAt: FieldValue;
  isCorrect?: boolean;
}

export interface Table {
  id: string;
  dbid: string;
  index: number;
  name: string;
  columns: any[];
  inEdit?: boolean;
  createdAt?: Date;
}

export interface DB {
  id: string;
  name: string;
  type: "PostgreSQL" | "MySQL" | "MariaDB" | "SQL Server";
  tables?: number;
}

export interface Column {
  name: string;
  type: string;
}

export interface ParsedJSON {
  [key: string]: Column[];
}

export interface QueryType {
  label: string;
  value: string;
}

export const queryTypes: QueryType[] = [
  { label: "Create Query", value: "create" },
  // { label: "Update Query", value: "update" },
  // { label: "Delete Query", value: "delete" },
  // { label: "Select Query", value: "select" },
  { label: "Optimize Query", value: "optimize" },
  // { label: "Suggest Indexes", value: "index" },
];

export const possibleIntents = ['create', 'update', 'delete', 'select', 'explain', 'optimize', 'index'];
