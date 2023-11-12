import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTable,
  updateTable
} from "../../../redux/reducers/databaseSlice";
import { RootState } from "../../../redux/store";
import { Table } from "../../../utils/types";

import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ErrorToast } from "@components/Toasts";

type Props = {
  table: Table;
  newTable?: boolean;
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

const Table = ({ table, newTable }: Props) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const { current } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );

  const [name, setName] = useState<string>(table.name);
  const [rows, setRows] = useState<any[]>(table.columns || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteInput, setDeleteInput] = useState<string>("");

  useEffect(() => {
    setName(table.name);
    setRows(table.columns || []);
  }, [table]);

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
    const updatedTable: Table = {
      ...table,
      columns: rows,
      name,
    };

    delete updatedTable.inEdit;
    setIsLoading(true);
    if (newTable) {
      dispatch(updateTable({ ...updatedTable, inEdit: false }));
      return;
    }

    try {
      setIsLoading(false);
      const response = await axios.post("/api/setTable", {
        table: updatedTable,
        uid: user?.sub,
      });
      dispatch(updateTable({ ...updatedTable, inEdit: false }));
      setIsLoading(false);
    } catch (err: any) {
      if (err?.response?.data?.duplicate) {
        ErrorToast(err?.response?.data?.message);
      } else {
        ErrorToast('Oops, something went wrong, please try again');
      }
    }
  };

  const handleDeleteTable = () => {
    setIsDeleting(true);
    axios
      .post("/api/deleteTable", { tableId: table.id, uid: user?.sub })
      .then(() => {
        dispatch(deleteTable(table.id));
        setIsDeleting(false);
        setDeleteInput("");
      })
      .catch((err) => {
        setIsDeleting(false);
        setDeleteInput("");
      });
  };

  const handleToggleEditTable = () => {
    dispatch(updateTable({ ...table, inEdit: true }));
  };

  const handleToggleCloseEdit = () => {
    if (table?.name) dispatch(updateTable({ ...table, inEdit: false }));
    else dispatch(deleteTable(table.id));
  };

  const disableSetTableButton = () => {
    if (rows.length > 0) {
      const prevRow = rows[rows.length - 1];
      if (prevRow?.name === "" || prevRow?.type === "") return true;
      else return false;
    }
    return true;
  };

  return (
    <div className="rounded-xl border-2 border-[#004CF7] text-[#7E7E7E]  dark:border-white p-3 bg-[#E8F2FFA1] dark:bg-[#2D2D2D]">
      <div className="w-full -top-1 mb-2 mt-2 flex justify-end">
        {table.inEdit ? (
          <>
            <button
              className={`cursor-pointer ${isLoading && "loading"}`}
              onClick={handleSetTable}
              disabled={disableSetTableButton()}
            >
              {!isLoading && (
                <span className="material-icons text-[#36D36A] text-[17px]">
                  done
                </span>
              )}
            </button>
            <button
              className={`cursor-pointer`}
              onClick={handleToggleCloseEdit}
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
              onClick={handleToggleEditTable}
              disabled={current?.id === "demo-db"}
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
                htmlFor={`delete-${table.name}`}
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
        <input
          type="text"
          className="mb-3 placeholder:font-light focus:outline-none border bg-white p-4 rounded-xl border-[#004CF7] text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full "
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!table.inEdit}
          placeholder="Table Name"
          autoFocus
          required
        />
      </div>

      <div className="border border-[#004CF7] rounded-xl rounded-r-xl dark:border-white overflow-y-scroll scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-rounded-full h-[200px]">
        <div className="table-wrp block max-h-96">
          <table className="table-compact w-full ">
            <thead className="border-b sticky top-0 table-header text-white px-4 border-none w-[100%]">
              <tr className="">
                <th className="text-left rounded-tl-xl">Column</th>
                <th className="text-left">Type</th>
                <th className="text-left rounded-tr-xl"></th>
              </tr>
            </thead>
            <tbody>
              <TableRows
                rows={rows}
                inEdit={table.inEdit || false}
                handleRowEdit={handleRowEdit}
                handleRowDelete={handleRowDelete}
              />

              {!table.inEdit && table.columns.length === 0 && (
                <tr className="active">
                  <td colSpan={3}>No columns added to {table.name}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {table.inEdit && (
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

      <input
        type="checkbox"
        id={`delete-${table.name}`}
        className="modal-toggle"
      />
      <div className="modal ">
        <div className="modal-box">
          <label
            htmlFor={`delete-${table.name}`}
            className="absolute right-2 top-2 btn btn-sm btn-circle"
          >
            <span className="material-icons">close</span>
          </label>
          <h3 className="font-bold text-lg text-[#004cf7] dark:text-white">
            Are you sure you want to delete {table.name}?
          </h3>
          <p className="py-2 flex text-[16px] text-[#004cf7] dark:text-white">You won&apos;t be able to revert this!</p>

          <p className="py-4 text-[16px] text-[#004cf7] dark:text-white">
            Type <b>{table?.name}</b> below to confirm deletion
          </p>
          
          <div className="modal-action w-full">
            <input
              type="text"
              className="input input-bordered w-full"
              onChange={(e) => setDeleteInput(e.target.value)}
              value={deleteInput}
            />
            <button
              className="btn bg-gradient-to-r from-[#0177e1] to-[#004cf7] hover:from-[#004cf7]  hover:to-[#085da9] border-none cursor-pointer text-white "
              onClick={handleDeleteTable}
              disabled={deleteInput !== table.name}
            >
              <label className="cursor-pointer" htmlFor={`delete -${table.name}`}>Delete</label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
