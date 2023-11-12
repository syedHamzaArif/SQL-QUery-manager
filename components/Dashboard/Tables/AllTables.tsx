import { useUser } from "@auth0/nextjs-auth0";
import EditDatabaseTable from "@components/Databases/EditDatabaseTable";
import { ErrorToast, SuccessToast } from "@components/Toasts";
import axios from "axios";
import {
  collection,
  getDocs, query as firestoreQuery, where
} from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Circles } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../firebase/firebase";
import {
  addTable,
  deleteTable,
  setCurrent,
  updateDB,
  updateTable
} from "../../../redux/reducers/databaseSlice";
import { RootState } from "../../../redux/store";
import { DB, Table } from "../../../utils/types";

interface IProps {
  tables: any;
  edit?: boolean;
  id: any;
  name: any;
}

const AllTables = ({ tables: propTables, edit }: IProps) => {
  const router = useRouter();
  const { user } = useUser();

  const dispatch = useDispatch();

  const [allTables, setAllTables] = React.useState<any>(propTables);

  const { all, current } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );


  const [force, setForce] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [changeButtonText, setChangeButtonText] = useState<boolean>(false);
  const [type, setType] = useState<DB["type"]>("PostgreSQL");
  const [loader, setloader] = React.useState(false);

  useEffect(() => setForce(!force), [allTables]);
  useEffect(() => setAllTables(propTables), [propTables]);
  useEffect(() => {
    const { name } = router.query;
    if (current && name !== current?.name) {
      router.replace("/dashboard/databases/" + current?.name);
    }
  }, [current]);

  const [editDataBase, setEditDatabase] = useState(edit ? edit : false);

  const handleEdit = () => {};


  useEffect(() => {
    setName(current?.name || "");
    setType(current?.type || "PostgreSQL");
  }, [current]);
  useEffect(() => {
    setloader(false);
  }, [allTables]);

  const handleUpdateDBClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const axiosConfig = {
      method: "put",
      url: "/api/updateDb",
      data: { dbId: current?.id, name: name.trim(), type },
    };
    if (name === "") {
      ErrorToast("Database name is required.");
      return;
    }

    try {
      const res = await axios(axiosConfig);
      if (res.status === 200) {
        updateTab();
        setChangeButtonText(true);
        if (current?.id) dispatch(updateDB({ id: current.id, name, type }));

        SuccessToast("Database updated");
        setEditDatabase(false);
      }
    } catch (err: any) {
      if (err?.response?.data?.duplicate) {
        ErrorToast(err?.response?.data?.message);
      } else {
        ErrorToast("Oops, something went wrong, please try again");
      }
    }
  };

  const handleDeleteTable = async (table: any) => {
    try {
      await axios.post("/api/deleteTable", {
        tableId: table.id,
        uid: user?.sub,
      });
      dispatch(deleteTable(table.id));
      setAllTables(propTables.filter((t: any) => t !== table));
    } catch (error) {}
  };
  const handleCreateTable = () => {
    const id = uuidv4();
    const table: Omit<Table, "index"> = {
      id,
      dbid: (current as DB).id,
      name: "",
      columns: [],
      inEdit: false,
    };
    setAllTables((prev: any) => [...prev, table]);
    dispatch(addTable(table));
  };

  const dbState = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  const inEdit = dbState.isNew || dbState.tables?.some((t) => t.inEdit);

  const updateTab = async () => {
    const databaseRef = collection(db, "users", `${user!.sub}`, "database");
    const q = firestoreQuery(databaseRef, where("name", "==", name));

    const databases = await getDocs(q);
    if (databases.docs.length === 0) return { notFound: true };
    const tableRef = collection(db, "users", `${user!.sub}`, "table");
    const databaseId = databases.docs[0].id;
    const q2 = firestoreQuery(tableRef, where("dbid", "==", databaseId));
    const tablesDocs = await getDocs(q2);
    const tables: any = tablesDocs.docs.map((table) => {
      const json: any = { ...table.data(), id: table.id };
      delete json.createdAt;
      delete json.updatedAt;
      return json;
    });
    dispatch(updateTable({ ...tables, inEdit: false }));
    setAllTables(tables);
  };

  const sort = () => {
    let x = [...all];
    x.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    return x;
  };

  return (
    <>
      <div className="w-[98%]  h-[13vh] text-xl font-semibold p-4 rounded-lg mt-3  flex justify-between items-center bg-white dark:bg-[#2D2D2D]">
        <div className="flex items-center">
          <span className="material-icons pr-3">dashboard</span>

          <span>Database</span>
        </div>

        <div className="flex items-center">
          {current && (
            <div className="form-control w-auto mx-auto my-4">
              <select
                className="select select-bordered bg-[#E8F2FF] dark:bg-[#2D2D2D] text-[#004CF7] dark:text-white border border-[#004CF7] dark:border-white w-[268px]"
                value={current.id}
                onChange={(e) => {
                  setloader(true);
                  dispatch(setCurrent(e.target.value));
                }}
                required
              >
                {sort()?.map((db, i) => (
                  <option value={db.id} key={i}>
                    {db.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ********************************* all data base information */}

      <div className="bg-white dark:bg-[#2D2D2D] h-[89vh] mt-4 w-[98%] rounded-lg px-2 py-4 flex flex-col justify-between">
        {loader && (
          <div className=" flex top-0 left-0 absolute w-full h-[100vh] ">
            <div className="w-full h-full flex justify-center items-center">
              <Circles
                height="30"
                width="30"
                color="#004CF7"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          </div>
        )}

        <div className="">
          {!editDataBase ? (
            <>
              <div className="flex mr-4 justify-between">
                <div>
                  <p className="text-[#004CF7] dark:text-white text-[20px] px-4 tracking-wide font-semibold capitalize">
                    {current?.name}
                  </p>
                </div>

                {current?.name !== "Demo" && (
                  <div className="flex ">
                    <div className="mr-2 cursor-pointer" onClick={handleEdit}>
                      <FiEdit
                        size={"20px"}
                        onClick={() => setEditDatabase(true)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {!allTables.length ? (
                <div className="w-full h-40  mt-4 rounded-lg flex flex-col items-center justify-center gap-4">
                  <div className="flex">
                    No tables in this database, click{" "}
                    <FiEdit
                      className="mx-2 cursor-pointer"
                      size={"20px"}
                      onClick={() => setEditDatabase(true)}
                    />{" "}
                    button to add a table
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 mt-4 ">
                  {allTables &&
                    allTables.length > 0 &&
                    allTables.map((table: any, i: any) => (
                      <div key={i}>
                        <div className="w-full py-2 px-4  ">
                          <div className="flex h-[100%] items-center ">
                            <p className="flex text-[16px] capitalize font-semibold text-black dark:text-white">
                              {table.name}
                            </p>
                          </div>

                          <div className="mt-2 border border-[#004CF7] rounded-xl rounded-r-lg scrollbar-thin overflow-y-scroll   scrollbar-thumb-rounded-full h-[300px] ">
                            <table className="table-compact w-full">
                              <thead className="border-b sticky top-0 table-header px-4 border-none w-[100%]">
                                <tr className="bg-[#E8F2FF] dark:bg-[#0043A8] text-left rounded-xl ">
                                  <th>Column</th>
                                  <th className="rounded-tr-xl">Type</th>
                                </tr>
                              </thead>

                              <tbody className="max-h-44 overflow-y-auto">
                                {table.columns.map((col: any, k: number) => (
                                  <tr key={k}>
                                    <td className="text-ellipsis overflow-hidden max-w-[10px] text-[#7E7E7E] font-medium dark:text-white">
                                      {col.name}
                                    </td>
                                    <td className="text-ellipsis overflow-hidden max-w-[10px] text-[#7E7E7E] font-medium dark:text-white">
                                      {col.type}
                                    </td>
                                  </tr>
                                ))}

                                {table.columns.length === 0 && (
                                  <tr>
                                    <td colSpan={3}>
                                      No columns added to {table.name}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <div className="mx-4 ">
                  <form className="mt-4 flex">
                    <div className="form-control w-[268px] mr-4 mb-4 md:mb-0 focus:outline-none">
                      <input
                        type="text"
                        placeholder="Enter Name"
                        className="w-[268px] input focus:outline-none bg-white dark:bg-[#2D2D2D] border-[#0177E1] dark:border-white placeholder:font-normal"
                        value={name}
                        // value={current?.name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        required
                      />
                    </div>
                    <div className="form-control w-[100%]">
                      <select
                        className="w-[268px] select focus:outline-none bg-white dark:bg-[#2D2D2D] border-[#0177E1] dark:border-white"
                        // value={type}
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
                </div>
              </div>

              <div className="grid grid-cols-3 xl:grid-cols-4 gap-0 px-4">
                {allTables &&
                  allTables.map((table: any, index: number) => (
                    <EditDatabaseTable
                      handleDeleteTable={handleDeleteTable}
                      key={table.name + index}
                      table={table}
                      // updateTab={updateTab}
                    />
                  ))}
              </div>

              {!allTables.length ? (
                <div className="w-full h-40  mt-4 rounded-lg flex flex-col items-center justify-center gap-4">
                  <p>No tables defined yet!</p>
                  <button
                    className="text-[15px] tracking-wide savebtn rounded-lg px-4 py-2 bg-[#004CF7] dark:bg-white text-white font-normal"
                    onClick={handleCreateTable}
                  >
                    Create first table
                  </button>
                </div>
              ) : (
                <div className="mx-4 my-4 w-[183px] h-[116px] rounded-lg flex justify-center items-center border-dashed border-2 border-[#004CF7] dark:border-white bg-[#E8F2FF] dark:bg-[#2D2D2D]">
                  <button
                    className="cursor-pointer"
                    onClick={handleCreateTable}
                    disabled={inEdit}
                  >
                    <span className="material-icons mr-1 text-[#004CF7] dark:text-white relative top-1">
                      add_circle
                    </span>{" "}
                    Add Table
                  </button>
                </div>
              )}

              <div className="mt-10 px-4">
                <button
                  className="text-[15px] tracking-wide rounded-lg px-4 py-2 border border-[#004CF7] dark:border-white dark:text-white mr-3 font-normal hover:bg-red-700 hover:text-white hover:border-red-700 uppercase"
                  onClick={() => {
                    setEditDatabase(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-[15px] tracking-wide bg-gradient-to-r from-[#0177e1] to-[#004cf7] hover:from-[#004cf7]  hover:to-[#085da9] rounded-lg px-4 py-2  dark:bg-white text-white font-normal uppercase"
                  onClick={handleUpdateDBClick}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
        {!editDataBase && (
          <div className="px-4 ">
            <button
              className="uppercase cursor-pointer border border-[#004CF7]  text-white dark:border-white] rounded-lg px-4 py-2 bg-gradient-to-r from-[#0177e1] to-[#004cf7] hover:from-[#004cf7]  hover:to-[#085da9]"
              onClick={() => router.push("/dashboard/databases")}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AllTables;
