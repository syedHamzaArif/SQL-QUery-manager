import { useUser } from "@auth0/nextjs-auth0";
import TableContainer from "@components/DatabaseSettings/Table/TableContainer";
import { ErrorToast, SuccessToast } from "@components/Toasts";
import axios from "axios";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  mariaDBParser,
  msSQLServerParser,
  mySQLParser,
  postgreSQLParser
} from "../../parser";
import {
  addDB,
  deleteDB,
  setCurrent,
  setTables
} from "../../redux/reducers/databaseSlice";
import { RootState } from "../../redux/store";
// import Table from "./EditDatabaseTable";
import { DB, ParsedJSON, Table } from "../../utils/types";

// interface IProps {
//   setScriptData(param: ParsedJSON): void;
// }
type DBProp = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  type: DB["type"];
  setType: React.Dispatch<React.SetStateAction<DB["type"]>>;
};

// type ImportProp = {
//   handleCreateDB?: (e: React.MouseEvent<HTMLElement>) => void;
//   name: string;
//   isLoading: boolean;
//   script: string;
//   setScript: React.Dispatch<React.SetStateAction<string>>;
//   handleImportFromScript: (e: React.MouseEvent<HTMLElement>) => void;
// };

const AddNewDatabase: FC<DBProp> = ({ name, setName, type, setType }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showTables, setShowTables] = useState<boolean>(true);
  const { user } = useUser();
  const [scriptData, setScriptData] = useState<ParsedJSON | null>({});
  const [page, setPage] = useState(0);
  const [isMore, setIsMore] = useState(true);
  const [isScript, setIsScript] = useState<boolean>(false);
  const [script, setScript] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [id] = useState<string>(uuidv4());
  const { current, tables: reduxTables } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );

  // const handleCreateDB = (e: React.MouseEvent<HTMLElement>) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   createDatabase();
  // };

  // const handleShowScript = (e: React.MouseEvent<HTMLElement>) => {
  //   e.preventDefault();
  //   setIsScript(true);
  // };

  // const handleCancelScript = (e: React.MouseEvent<HTMLElement>) => {
  //   e.preventDefault();
  //   setIsScript(false);
  // };

  // const handleCancelCreate = (e: React.MouseEvent<HTMLElement>) => {
  //   e.preventDefault();
  //   dispatch(setTables([]));
  // };

  const handleImportFromScript = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let jsoned = null;

    try {
      switch (type) {
        case "PostgreSQL":
          jsoned = postgreSQLParser(script);
          break;
        case "MySQL":
          jsoned = mySQLParser(script);
          break;
        case "MariaDB":
          jsoned = mariaDBParser(script);
          break;
        case "SQL Server":
          jsoned = msSQLServerParser(script);
          break;
      }
      if (Object.keys(jsoned).length === 0) {
        setIsLoading(false);
        return ErrorToast(
          "No CREATE statements found in the import script"
        );
      } else {
        setScriptData(jsoned);
        setScript("");
        setShowTables(true);
      }
    } catch (error) {
      setIsLoading(false);
      return ErrorToast(
        " Import script is not valid"
      );
    }
  };

  const deleteDb = async () => {
    const axiosConfig = {
      method: "post",
      url: "/api/deleteDbByName",
      data: {
        uid: user?.sub,
        dbName: name,
      },
    };
    try {
      const res = await axios(axiosConfig);
      if (res?.data?.success) {
        SuccessToast("Database deleted");

        dispatch(deleteDB(res?.data?.dbId as string));


        return true;
      }
    } catch (error) {
      ErrorToast("Error deleting database");
      return false;
    }
  };

  const setData = async () => {
    const keys = Object.keys(scriptData!);
    if (keys.length === 0 && reduxTables.length === 0) return;
    const tables: Table[] = [];
    let count = 0;
    keys.forEach((key) => {
      if (!scriptData![key]) return;
      const tableId = uuidv4();
      const table: Table = {
        id: tableId,
        dbid: id,
        name: key,
        columns: scriptData![key],
        index: count++,
      };
      tables.push(table);
    });
    try {
      const axiosConfig = {
        method: "post",
        url: "/api/importScript",
        data: {
          tables: [
            ...tables,
            ...reduxTables.map((table) => ({ ...table, dbid: id })),
          ],
          uid: user?.sub,
        },
      };
      await axios(axiosConfig);
      // dispatch(updateDB({ ...newDB! }))
      SuccessToast("Database added");

    } catch (error) {
      ErrorToast("Database was not added")
    }
  };

  const createDatabase = async (jsoned?: ParsedJSON | null) => {
    if (name === "") {
      SuccessToast("Database name is required.");
      return;
    }
    try {
      await axios.post("/api/setDb", {
        db: { name: name.trim(), type, id },
        uid: user?.sub,
      });
      dispatch(addDB({ id, name, type }));
      dispatch(setCurrent(id));
      setIsLoading(false);
      await setData();
      setScript("");
      router.push("/dashboard/databases/");
    } catch (err: any) {
      if (err.response.data.code === "ALREADY EXISTS") {
        const res = confirm(
          "A database exists with the same name. Do you want to overwrite it?"
        );
        if (res) {
          const delRes = await deleteDb();
          if (delRes) {
            await createDatabase(jsoned);
          }
        }
      }
      setIsLoading(false);
    }
  };

  // const handleAddNewDB = () => {
  //   dispatch(setIsNew(true));
  // };


  useEffect(() => {
    if (!scriptData) return;
    const keys = Object.keys(scriptData!);
    if (keys.length === 0) return;
    const tables: Table[] = [];
    let count = 0;
    keys.forEach((key) => {
      if (!scriptData![key]) return;
      const table: Table = {
        id,
        dbid: id,
        name: key,
        columns: scriptData![key],
        index: count++,
      };
      tables.push(table);
    });
    dispatch(setTables(tables));
    // setData();
  }, [scriptData]);



  useEffect(() => {
    setIsMore(true);
  }, [current, page]);

  useEffect(() => {
    dispatch(setTables([]));
  }, []);


  return (
    <>
      <div className="w-[98%] h-[89vh] text-xl font-semibold p-4 rounded-lg mt-3  bg-white dark:bg-[#2D2D2D]">
        <p>Add New Database</p>

        <div className="w-[40%]">
          <form className="mt-4 items-center flex justify-start">
            <div className="form-control w-[100%] mr-4 mb-4 md:mb-0 focus:outline-none">
              <input
                type="text"
                placeholder="Enter Name"
                className="input focus:outline-none bg-white dark:bg-[#2D2D2D] border-[#e83864] dark:border-white placeholder:font-normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="form-control w-[100%]">
              <select
                className="select focus:outline-none bg-white dark:bg-[#2D2D2D] border-[#e83864] dark:border-white"
                value={type}
                onChange={(e) => setType(e.target.value as DB["type"])}
              >
                <option>PostgreSQL</option>
                <option>MySQL</option>
                <option>MariaDB</option>
                <option>SQL Server</option>
              </select>
            </div>
          </form>

          <div className="flex justify-start mt-4">
            <button
              className={` uppercase py-3 rounded-xl bg-[#E8F2FF]  px-4 border-none mr-3 text-[15px] tracking-wide ${!showTables
                ? "!bg-[#e83864] dark:bg-white text-white "
                : "border-[#5b6065] dark:border-white dark:text-black"
                }`}
              onClick={() => setShowTables(false)}
            >
              Import From Script
            </button>
            <button
              className={`uppercase py-3 rounded-xl  bg-[#E8F2FF]  px-4 border-none mr-3 text-[15px] tracking-wide ${showTables
                ? "!bg-[#e83864] dark:bg-white text-white"
                : "border-[#5b6065] dark:border-white dark:text-black"
                }`}
              onClick={() => setShowTables(true)}
            >
              Create Tables
            </button>
          </div>
        </div>

        {!showTables ? (
          <>
            <div className="w-[40%] mt-2">
              <span className="text-[#e83864] text-lg">NOTE: Only the first 100 tables will be imported</span>
              <div className="w-auto">
                <textarea
                  placeholder="Paste Your SQL Here.....!"
                  required
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="mt-4 w-full min-h-[15rem]  border bg-white p-4 rounded-xl border-[#3b1d17] text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white focus:outline-none"
                />
              </div>
              <div className="flex items-center mt-2">
                <button
                  className="w-[80px] btn btn-square  bg-gradient-to-r from-[#e83864] to-[#3b1d17] border-none hover:from-[#3b1d17]  hover:to-[#a8072f] dark:text-white"
                  onClick={handleImportFromScript}
                >
                  Import
                </button>
              </div>
            </div>
            <div className="">
              <div className="mt-8">
                <TableContainer
                  newTable={true}
                  page={page}
                  setPage={setPage}
                  isMore={isMore}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="">
            <div className="mt-8">
              <TableContainer
                newTable={true}
                page={page}
                setPage={setPage}
                isMore={isMore}
              />
            </div>
          </div>
        )}

        {/* save button div */}
        <div className="mt-10">
          <button
            className="uppercase text-[15px] tracking-wide rounded-lg px-4 py-2 border border-[#3b1d17] dark:border-white dark:text-white mr-3 font-normal hover:bg-red-700 hover:text-white hover:border-red-700"
            onClick={() => router.push("/dashboard/databases")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="uppercase w-[80px] btn btn-square  bg-gradient-to-r from-[#e83864] to-[#3b1d17] border-none hover:from-[#3b1d17]  hover:to-[#a8072f] dark:text-white"
            onClick={() => createDatabase()}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AddNewDatabase;
