import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  appendTables,
  setCurrent,
  setIsNew,
  setTables,
} from "../../redux/reducers/databaseSlice";
import { RootState } from "../../redux/store";
import { DB, ParsedJSON, Table } from "../../utils/types";
import DbDelete from "./DbDelete";
import DbForm from "./DbForm";
import TableContainer from "./Table/TableContainer";
import darkmodeicon from "../../public/newpictures/dark_icon.svg";
import lightmodeicon from "../../public/newpictures/light_icon.svg";
import Image from "next/image";
import { setDarkModeTheme } from "../../redux/reducers/darkModeSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { AiOutlineDatabase } from "react-icons/ai";
import AllDatabases from "@components/Databases/AllDatabases";

const DbSettings = () => {
  const dispatch = useDispatch();
  const { all, current, isNew } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );

  const newTheme = useSelector(
    (state: RootState) => state.persistedReducer.darkmode.theme
  );

  const [scriptData, setScriptData] = useState<ParsedJSON | null>({});
  const [page, setPage] = useState(0);
  const [isMore, setIsMore] = useState(true);
  const { user } = useUser();

  const handleAddNewDB = () => {
    dispatch(setIsNew(true));
  };

  useEffect(() => {
    if (!scriptData) return;
    const keys = Object.keys(scriptData!);
    if (keys.length === 0) return;
    const tables: Table[] = [];
    let count = 0;
    keys.forEach((key) => {
      const id = uuidv4();
      if (!scriptData![key]) return;
      const table: Table = {
        id,
        dbid: (current as DB).id,
        name: key,
        columns: scriptData![key],
        index: count++,
      };
      tables.push(table);
    });
    const setData = async () => {
      try {
        const axiosConfig = {
          method: "post",
          url: "/api/importScript",
          data: {
            tables,
            uid: user?.sub,
          },
        };
        await axios(axiosConfig);
      } catch (error) {
      }
    };
    setData();
  }, [scriptData]);

  const getTables = async (dbId: string) => {
    const config = {
      method: "GET",
      url: `/api/tables/?dbId=${dbId}&page=${page}`,
    };
    await axios(config)
      .then((res) => {
        if (res?.status) {
          if (page === 0) {
            dispatch(setTables(res?.data?.tables));
          } else {
            dispatch(appendTables(res?.data?.tables));
          }
          if (res?.data?.tables?.length <= 4) setIsMore(false);
        }
      })
      .catch((err) => {
      });
  };

  useEffect(() => {
    setIsMore(true);
    if (current?.id) getTables(current.id);
  }, [current, page]);

  

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "add") handleAddNewDB();
    else {
      dispatch(setCurrent(e.target.value));
      setPage(0);
    }
  };

  const handleTheme = () => {
    dispatch(setDarkModeTheme(newTheme === "light" ? "light" : "dark"));
  };

  

  return (
    <>
      <div className="w-[98%] h-[88px] text-xl font-semibold	p-4 rounded-lg mt-3  flex justify-between items-center bg-white dark:bg-[#2D2D2D]">
        <div className="flex items-center">
          <FiSettings className="text-[21px] mr-3" />

          <span>Settings</span>
        </div>

        <div className="flex items-center">
          <span className="material-icons text-3xl " onClick={handleTheme}>
            dark_mode
          </span>
        </div>
      </div>

      <div className="py-4 w-full pr-4">
        {current && !isNew && (
          <div className="form-control w-full mb-4 sm:mb-0 sm:h-0 sm:relative sm:left-3/4 lg:left-[75%] top-4">
            <select
              className="select select-bordered w-48"
              value={current.id}
              onChange={handleChange}
              // disabled={isNew}
              required
            >
              {all.map((db, i) => (
                <option value={db.id} key={i}>
                  {db.name}
                </option>
              ))}

              <option className="bg-success text-black" value={"add"}>
                Add New
              </option>
            </select>
          </div>
        )}

        <AllDatabases />

        {/* Commits the new DB to database and sets isNew to false and function returns here. */}
        {(current || isNew) && <DbForm setScriptData={setScriptData} />}

        {!current && all?.length === 0 && !isNew && (
          <div className="w-fit flex flex-col items-center gap-4 relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold">No Database created, yet!</h3>
            <button className="btn btn-success" onClick={handleAddNewDB}>
              Create Database
            </button>
          </div>
        )}

        {current && !isNew && (
          <div className="mt-8">
            <TableContainer page={page} setPage={setPage} isMore={isMore} />
          </div>
        )}

        {current && !isNew && current.id !== "demo-db" && (
          <div className="mt-8">
            <DbDelete />
          </div>
        )}

        {current && current.id === "demo-db" && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Danger Zone</h3>

            <div className="border border-error rounded-lg p-4 mt-8">
              <p>The Demo database cannot be deleted</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DbSettings;
