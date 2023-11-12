import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Table as TableType } from "../../../utils/types";
import Table from "./Table";

type Props = {
  tables: TableType[];
  handleCreateTable: () => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isMore: boolean;
};

const TableList = ({
  tables,
  handleCreateTable,
  page,
  setPage,
  isMore,
}: Props) => {
  const dbState = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  const isInEdit = dbState.isNew || dbState.tables?.some((t) => t.inEdit);

  return (
    // <div >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {tables?.map((t, i) => (
        <Table table={t} key={i} />
      ))}

      {dbState?.current?.id !== "demo-db" ? (
        <div className="h-40 w-full rounded-lg flex justify-center items-center">
          <button
            className="btn btn-success"
            onClick={handleCreateTable}
            disabled={isInEdit}
          >
            Add Table <span className="material-icons ml-2">add</span>
          </button>
        </div>
      ) : null}

      {isMore && (
        <div className="h-40 w-full rounded-lg flex justify-center items-center">
          <button
            className="btn btn-success"
            onClick={() => {
              setPage(page + 1);
            }}
            disabled={isInEdit}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default TableList;
