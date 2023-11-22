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
  newTable?: boolean;
};

const TableList = ({
  tables,
  handleCreateTable,
  newTable,
  page,
  setPage,
  isMore,
}: Props) => {
  const dbState = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  const isInEdit = dbState.isNew || dbState.tables?.some((t) => t.inEdit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
      {tables?.map((t, i) => (
        <Table newTable={newTable} table={t} key={i} />
      ))}

      {/* {true ? ( */}
      <div className="w-[183px] h-[116px] rounded-lg flex justify-center items-center border-dashed border-2 border-[#3b1d17] dark:border-white bg-[#E8F2FF] dark:bg-[#2D2D2D] ">
        <button
          className="cursor-pointer"
          onClick={handleCreateTable}
          disabled={isInEdit}
        >
          <span className="material-icons mr-1 text-[#3b1d17] dark:text-white relative top-1">
            add_circle
          </span>{" "}
          Add Table
        </button>
      </div>
      {/* // ) : null} */}

      {/* {isMore && (
        <div className="h-40 w-full rounded-lg flex justify-center items-center">
          <button
            className=" savebtn px-4 text-white py-3 text-[15px] rounded-xl"
            onClick={() => {
              setPage(page + 1);
            }}
            disabled={isInEdit}
          >
            Show More
          </button>
        </div> */}
      {/* )} */}
    </div>
  );
};

export default TableList;
