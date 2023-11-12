import { v4 as uuidv4 } from "uuid";
import { DB, Table } from "../../../utils/types";
import TableList from "./TableList";
import { useDispatch, useSelector } from "react-redux";
import { addTable } from "../../../redux/reducers/databaseSlice";
import { RootState } from "../../../redux/store";
import { FC } from "react";

type Props = {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  isMore: boolean
}

const TableContainer: FC<Props> = ({page, setPage, isMore}) => {
  
  const dispatch = useDispatch()
  const { current, tables } = useSelector((state: RootState) => state.persistedReducer.userDatabases);

  const handleCreateTable = () => {
    const id = uuidv4();
    const table: Omit<Table, "index"> = {
      id,
      dbid: (current as DB).id,
      name: "",
      columns: [],
      inEdit: true,
    };
    dispatch(addTable(table))
  };

  return (
    <>
      <h3 className="text-lg font-semibold">Tables</h3>

      {tables?.length === 0 ? (
        <div className="w-full h-40 bg-base-200 mt-4 rounded-lg flex flex-col items-center justify-center gap-4">
          <p>No tables defined for {current?.name}, yet!</p>
          <button className="btn btn-success" onClick={handleCreateTable}>
            Create first table
          </button>
        </div>
      ) : (
        <TableList
          tables={tables}
          handleCreateTable={handleCreateTable}
          page={page}
          setPage={setPage}
          isMore={isMore}
        />
      )}
    </>
  );
};

export default TableContainer;
