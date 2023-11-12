import React, { useState } from "react";
import { AiOutlineDatabase } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import AllDatabases from "./AllDatabases";
import DbForm from "@components/Settings/DbForm";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ParsedJSON, Table } from "../../utils/types";
import AddNewDatabase from "./AddNewDatabase";
import DbSettings from "@components/Settings/DbSettings";
import { useRouter } from "next/router";
import { setCurrent, setTables } from "../../redux/reducers/databaseSlice";
import { useDispatch } from "react-redux";
import EditDatabase from "./EditDatabaseTable";

const Databases = () => {
  const { all, current, isNew, tables } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );

  const dispatch = useDispatch();
  const [scriptData, setScriptData] = useState<ParsedJSON | null>({});
  const [showAllDatabase, setShowAllDatabase] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="w-[98%] h-[13vh] text-xl font-semibold	p-4 rounded-lg mt-3  flex justify-between items-center bg-white dark:bg-[#2D2D2D] ">
        <div className="flex items-center">
          <AiOutlineDatabase className="text-[21px] mr-3" />
          <span>Databases</span>
        </div>

        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            dispatch(setTables([]));
            // dispatch(setCurrent(""));
            router.push("/dashboard/databases/add");
          }}
        >
          <span className="material-icons mr-1">add_circle</span>
          <span className="tracking-wide">Add New Database</span>
        </div>
      </div>

    
        <AllDatabases />
    

      {/* <EditDatabase tables={tables} /> */}
    </>
  );
};

export default Databases;
