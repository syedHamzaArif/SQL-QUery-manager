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
  newTable?: boolean;
}

const TableContainer: FC<Props> = ({ page, setPage, isMore, newTable }) => {
  
  const dispatch = useDispatch()
  const { current, tables } = useSelector((state: RootState) => state.persistedReducer.userDatabases);

  const handleCreateTable = () => {
    const id = uuidv4();
    const table: Omit<Table, "index"> = {
      id,
      dbid: (current as DB)?.id,
      name: "",
      columns: [],
      inEdit: true,
    };
    dispatch(addTable(table))
  };

  return (
    <>
      

      {tables?.length === 0 ? (
        <div className="w-full h-40  mt-4 rounded-lg flex flex-col items-center justify-center gap-4">
          <p>No tables defined yet!</p>
          <button className="uppercase w-[160px] btn btn-square  bg-gradient-to-r from-[#0177e1] to-[#004cf7] border-none hover:from-[#004cf7]  hover:to-[#085da9] dark:text-white" onClick={handleCreateTable}>
            Create first table
          </button>
        </div>
      ) : (
        <TableList
          newTable={newTable}
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
