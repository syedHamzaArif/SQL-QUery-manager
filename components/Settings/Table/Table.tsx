import { useUser } from "@auth0/nextjs-auth0";
import { ErrorToast } from "@components/Toasts";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTable,
  updateTable
} from "../../../redux/reducers/databaseSlice";
import { RootState } from "../../../redux/store";
import { Table } from "../../../utils/types";

type Props = {
  table: Table;
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
          <tr key={i} className="active">
            <td className="text-ellipsis overflow-hidden max-w-[10px]">
              {col.name}
            </td>
            <td className="text-ellipsis overflow-hidden max-w-[10px]">
              {col.type}
            </td>
            <td>
              <button
                className="btn btn-circle btn-sm btn-error"
                onClick={() => handleRowDelete(i)}
                disabled={true}
              >
                <span className="material-icons">delete</span>
              </button>
            </td>
          </tr>
        ) : (
          <tr key={i} className="active">
            <td>
              <label>
                <input
                  type="text"
                  className="input input-sm input-bordered w-full"
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
                  className="input input-sm input-bordered w-full"
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
                className="btn btn-circle btn-sm btn-error"
                onClick={() => handleRowDelete(i)}
              >
                <span className="material-icons">delete</span>
              </button>
            </td>
          </tr>
        )
      )}
    </>
  );
};

const Table = ({ table }: Props) => {
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

  const handleSetTable = () => {
    const updatedTable: Table = {
      ...table,
      columns: rows,
      name,
    };

    delete updatedTable.inEdit;
    setIsLoading(true);

    axios
      .post("/api/setTable", { table: updatedTable, uid: user?.sub })
      .then(() => {
        dispatch(updateTable({ ...updatedTable, inEdit: false }));
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.response?.data?.duplicate) {
          ErrorToast(err?.response?.data?.message);
        } else {
        }
        setIsLoading(false);
      });
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
    if (current?.id === "demo-db") return true;
    if (name.length > 0) {
      if (rows.length > 0) {
        const prevRow = rows[rows.length - 1];
        if (prevRow?.name === "" || prevRow?.type === "") return true;
        else return false;
      }
    }
    return true;
  };

  return (
    <div>
      <div className="relative w-20 -top-1  grid grid-cols-2 mb-2">
        {table.inEdit ? (
          <>
            <button
              className={`btn btn-circle btn-sm btn-success ${
                isLoading && "loading"
              }`}
              onClick={handleSetTable}
              disabled={disableSetTableButton()}
            >
              {!isLoading && <span className="material-icons">done</span>}
            </button>
            <button
              className={`btn btn-circle btn-sm btn-error`}
              onClick={handleToggleCloseEdit}
              // disabled={table.name.length === 0}
            >
              <span className="material-icons">close</span>
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-circle btn-sm btn-warning"
              onClick={handleToggleEditTable}
              disabled={current?.id === "demo-db"}
            >
              <span className="material-icons">edit</span>
            </button>

            {current?.id === "demo-db" ? (
              <button
                className="btn btn-circle btn-sm btn-error"
                disabled={current?.id === "demo-db"}
              >
                <span className="material-icons">delete</span>
              </button>
            ) : (
              <label
                htmlFor={`delete-${table.name}`}
                className={`btn btn-circle btn-sm btn-error ${
                  isDeleting && "loading"
                }`}
              >
                {!isDeleting && <span className="material-icons">delete</span>}
              </label>
            )}
          </>
        )}
      </div>

      <div className="w-full mb-2">
        <input
          type="text"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!table.inEdit}
          placeholder="Table Name"
          autoFocus
          required
        />
      </div>
      <table className="table w-full">
        <thead> 
          <tr>
            <th>Column</th>
            <th>Type</th>
            <th></th>
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
      {table.inEdit && (
        <button
          className="btn btn-sm btn-success mt-4 w-full"
          onClick={handleAddCols}
        >
          Add Column <span className="material-icons">add</span>
        </button>
      )}

      <input
        type="checkbox"
        id={`delete-${table.name}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <label
            htmlFor={`delete-${table.name}`}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            <span className="material-icons">close</span>
          </label>
          <h3 className="font-bold text-lg">
            Are you sure you want to delete {table.name}?
          </h3>
          <p className="py-4">
            Type {table.name} below to confirm deletion (this process is not
            reversible)
          </p>
          <div className="modal-action w-full">
            <input
              type="text"
              className="input input-bordered w-full"
              onChange={(e) => setDeleteInput(e.target.value)}
              value={deleteInput}
            />
            <button
              className="btn btn-error"
              onClick={handleDeleteTable}
              disabled={deleteInput !== table.name}
            >
              <label htmlFor={`delete-${table.name}`}>Delete</label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
