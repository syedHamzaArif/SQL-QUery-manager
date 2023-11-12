import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ErrorToast } from "@components/Toasts";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  updateTable
} from "../../redux/reducers/databaseSlice";
import { RootState } from "../../redux/store";
import { Table } from "../../utils/types";

type Props = {
  table: any;
  handleDeleteTable?: any;
};

type TableRowProps = {
  rows: Table["columns"];
  inEdit: boolean;
  handleRowEdit: (
    e: ChangeEvent<HTMLInputElement>,
    i: number,
    field: "name" | "type"
  ) => void;
  handleRowDelete: (i: number) => void;
};

const TableRows = ({
  rows,
  inEdit,
  handleRowEdit,
  handleRowDelete,
}: TableRowProps) => {
  return (
    <>
      {rows.map((col, i) =>
        !inEdit ? (
          <tr key={i}>
            <td className="text-ellipsis overflow-hidden max-w-[10px] tracking-wide font-normal dark:text-white">
              {col.name}
            </td>
            <td className="text-ellipsis overflow-hidden max-w-[10px] tracking-wide font-normal dark:text-white">
              {col.type}
            </td>

            {inEdit && (
              <td>
                <button
                  className="cursor-pointer"
                  onClick={() => handleRowDelete(i)}
                  disabled={true}
                >
                  <RiDeleteBin6Line className="text-[17px] text-[#004CF7] dark:text-white" />
                </button>
              </td>
            )}
          </tr>
        ) : (
          <tr key={i}>
            <td>
              <label>
                <input
                  type="text"
                  className="placeholder:font-light focus:outline-none border bg-white p-2 rounded-xl border-[#004CF7] text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full "
                  value={col.name}
                  onChange={(e) => handleRowEdit(e, i, "name")}
                  disabled={!inEdit}
                  placeholder="Name"
                  autoFocus
                  required
                />
              </label>
            </td>
            <td>
              <label>
                <input
                  type="text"
                  className="focus:outline-none border bg-white p-2 rounded-xl border-[#004CF7] text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full placeholder:font-light"
                  value={col.type}
                  onChange={(e) => handleRowEdit(e, i, "type")}
                  disabled={!inEdit}
                  placeholder="Type"
                  required
                />
              </label>
            </td>
            <td>
              <button
                className="cursor-pointer"
                onClick={() => handleRowDelete(i)}
              >
                <RiDeleteBin6Line className="text-[17px] text-[#004CF7] dark:text-white" />
              </button>
            </td>
          </tr>
        )
      )}
    </>
  );
};

const Table = ({ table, handleDeleteTable }: Props) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const { current } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  const [name, setName] = useState<string>(table.name);
  const [rows, setRows] = useState<any[]>(table.columns || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [inEdit, setInEdit] = useState(false);

  useEffect(() => {
    setName(table.name);
    setRows(table.columns || []);
  }, [table]);

  const enableEdit = () => {
    setInEdit(true);
  };

  const disableEdit = () => {
    setInEdit(false);
    setName(table.name);
    setRows(table.columns);
  };

  const handleAddCols = () => {
    if (rows.length > 0) {
      const prevRow = rows[rows.length - 1];
      if (prevRow?.name === "" || prevRow?.type === "") return;
    }
    setRows((prev) => [...prev, { name: "", type: "" }]);
  };

  const handleRowEdit = (
    e: ChangeEvent<HTMLInputElement>,
    i: number,
    type: "name" | "type"
  ) => {
    setRows((prev) =>
      prev.map((col, j) => {
        if (j === i) {
          return type === "name"
            ? { ...col, name: e.target.value }
            : { ...col, type: e.target.value };
        }
        return col;
      })
    );
  };

  const handleRowDelete = (i: number) => {
    setRows((prev) => prev.filter((row, j) => i !== j));
  };

  const handleSetTable = async () => {
    if (checkIfNoRows()) return;
    const updatedTable: Table = {
      ...table,
      columns: rows,
      name,
    };

    if (name === "") {
      ErrorToast("Please Enter Table Name");
      return;
    }
    delete updatedTable.inEdit;
    setIsLoading(true);

    try {
      setIsLoading(false);
      await axios.post("/api/tables/update-table", {
        table: updatedTable,
        uid: user?.sub,
      });
      setInEdit(false);
      dispatch(updateTable({ ...updatedTable, inEdit: false }));
      setIsLoading(false);
    } catch (err: any) {
      if (err?.response?.data?.duplicate) {
        ErrorToast("Table name already exists.");
      } else {
        ErrorToast("Oops, something went wrong, please try again");
      }
    }
  };

  // const handleToggleEditTable = () => {
  //   dispatch(updateTable({ ...table, inEdit: true }));
  // };

  // const handleToggleCloseEdit = () => {
  //   if (table?.name) dispatch(updateTable({ ...table, inEdit: false }));
  //   else dispatch(deleteTable(table.id));
  // };

  const checkIfNoRows = () => {
    if (rows.length > 0) {
      const prevRow = rows[rows.length - 1];
      if (prevRow?.name === "" || prevRow?.type === "") {
        ErrorToast(
          "A table must have at least 1 column."
        );
        return true;
      } else return false;
    }
    ErrorToast(
      "A table must have at least 1 column."
    );
    return true;
  };

  return (
    <>
      <div className="w-[90%] mt-5 rounded-xl border-2 border-[#004CF7] text-[#7E7E7E]  dark:border-white p-3 bg-[#E8F2FFA1] dark:bg-[#2D2D2D]">
        <div className="w-full -top-1 mb-0 mt-2 flex justify-end">
          {inEdit ? (
            <>
              <button
                className={`cursor-pointer ${isLoading && "loading"}`}
                onClick={handleSetTable}
              >
                {!isLoading && (
                  <span className="material-icons text-[#36D36A] text-[17px]">
                    done
                  </span>
                )}
              </button>
              <button
                className={`cursor-pointer`}
                onClick={disableEdit}
                // disabled={table.name.length === 0}
              >
                <span className="material-icons text-[#D81616] text-[17px]">
                  close
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                className="cursor-pointer"
                onClick={enableEdit}
                // disabled={current?.id === "demo-db"}
              >
                <FiEdit className="text-[17px] text-[#004CF7] dark:text-white mr-2" />
              </button>

              {current?.id === "demo-db" ? (
                <button
                  className="cursor-pointer"
                  disabled={current?.id === "demo-db"}
                >
                  <RiDeleteBin6Line className="text-[17px] text-[#004CF7] dark:text-white" />
                </button>
              ) : (
                <label
                  // htmlFor={`delete-${table.name}`}
                  htmlFor={`tableDelete-${table.name}`}
                  className={`cursor-pointer   ${isDeleting && "loading"}`}
                >
                  {!isDeleting && (
                    <RiDeleteBin6Line className="text-[17px] text-[#004CF7] dark:text-white" />
                  )}
                </label>
              )}
            </>
          )}
        </div>

        <div className="w-full mb-2">
          {inEdit ? (
            <input
              type="text"
              className="mb-3 placeholder:font-light focus:outline-none border bg-white p-4 rounded-xl border-[#004CF7] text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full "
              value={name}
              onChange={(e) => setName(e.target.value)}
              // disabled={!table.inEdit}
              placeholder="Table Name"
              autoFocus
              required
            />
          ) : (
            <p className="text-ellipsis overflow-hidden max-w-[10px text-[#004CF7] dark:text-white text-[20px] px-2 tracking-wide font-semibold capitalize">
              {name}
            </p>
          )}
        </div>

        <div className="border border-[#004CF7] rounded-xl rounded-r-xl dark:border-white overflow-y-scroll scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-rounded-full h-[200px]">
          <div className="table-wrp block max-h-96">
            <table className="w-full table-compact">
              <thead className="border-b sticky top-0 table-header text-white px-4 border-none w-[100%]">
                <tr className=" text-left rounded-xl">
                  <th className="text-left rounded-tl-xl">Column</th>
                  <th className="text-left">Type</th>
                  <th className="text-left rounded-tr-xl"></th>
                </tr>
              </thead>
              <tbody className="max-h-44 overflow-y-auto">
                <TableRows
                  rows={rows}
                  inEdit={inEdit}
                  handleRowEdit={handleRowEdit}
                  handleRowDelete={handleRowDelete}
                />
              </tbody>
            </table>
          </div>
        </div>

        {inEdit && (
          <div>
            {inEdit && (
              <button
                className="mt-4 w-full text-[#004CF7] dark:text-white text-left"
                onClick={handleAddCols}
              >
                <span className="material-icons mr-1 text-[#004CF7] dark:text-white relative top-1">
                  add_circle
                </span>
                Add Column
              </button>
            )}
          </div>
        )}
      </div>

      <input
        type="checkbox"
        id={`tableDelete-${table.name}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box bg-white dark:bg-[#2D2D2D]">
          <label
            htmlFor={`tableDelete-${table.name}`}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            <span className="material-icons text-[20px]">close</span>
          </label>
          <h2 className="font-bold text-lg mt-5">
            Are you sure you want to delete the {table.name} table?
          </h2>
          <p className="py-2 flex">You won&apos;t be able to revert this!</p>
          <div className="modal-action w-full  justify-start">
            <div className="flex">
              <label
                className="text-[14px] tracking-wide rounded-lg px-4 pt-3 cursor-pointer border border-[#004CF7] dark:border-white dark:text-white mr-3  hover:bg-red-700 hover:text-white hover:border-red-700 uppercase"
                htmlFor={`tableDelete-${table.name}`}
              >
                Cancel
              </label>
              <button
                className="btn border-none mx-2 bg-gradient-to-r from-[#0177e1] to-[#004cf7] hover:from-[#004cf7]  hover:to-[#085da9] text-white uppercase"
                onClick={() => handleDeleteTable && handleDeleteTable(table)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
