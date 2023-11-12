import React from "react";
import EditDatabaseTable from "@components/Databases/EditDatabaseTable";
import tables from "../../api/tables";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { Table } from "../../../utils/types";
import { table } from "console";

type Props = {
  table: any;
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  isMore: boolean
};

const EditDatabase = () => {
  const { current, tables } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );  

  return (
    <>
      <EditDatabaseTable table={tables} />
    </>
  );
};


export default EditDatabase;
