import axios from "axios";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  appendTables,
  setCurrent,
  setTables,
} from "../../redux/reducers/databaseSlice";
import { RootState } from "../../redux/store";
import {
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
  AiOutlineDatabase,
} from "react-icons/ai";


interface Iprops {
  setPage: Dispatch<SetStateAction<number>>;
  page:number;
}

const RightPanel:FC<Iprops> = ({setPage,page}) => {
  const dispatch = useDispatch();
  const { all, current, tables, isNew } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );

  const [rightSideBar, setRightSideBar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isMore, setIsMore] = useState(true);

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
          if (res?.data?.tables?.length <=4) setIsMore(false);
        }
      })
      .catch((err) => {
      });
  };

  useEffect(() => {
    setIsMore(true);
    if (current?.id) getTables(current.id);
  }, [current, page]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tables]);  

  return (
    <div
      className={`drawer h-full sticky overflow-hidden  ${
        rightSideBar ? "w-[302px]" : "w-[80px]"
      }`}
    >
      <aside
        className="w-80 h-[95%] pr-[27px] border-lg rounded-r-lg bg-white dark:bg-[#2D2D2D] overflow-x-hidden flex flex-col sticky left-full top-0 scrollbar-thin scrollbar-thumb-base-200 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
        aria-label="Sidebar"
      >
        {rightSideBar ? (
          <div className="h-full">
            {tables && tables.length > 0 ? (
              tables.map((table, i) => (
                <div key={i}>
                  <div className="w-full py-2 px-4 ">
                    <div className="flex h-[100%] items-center ">
                      <AiOutlineDatabase className="text-[35px]" />
                      <p className="flex text-[20px] capitalize font-semibold text-[#004CF7] dark:text-white">
                        {table.name}
                      </p>
                    </div>

                    <div className="mt-4 border border-[#004CF7] rounded-xl rounded-r-lg">
                      <table className="table-compact w-full">
                        <thead>
                          <tr className="bg-[#E8F2FF] dark:bg-[#0043A8] text-left ">
                            <th className="rounded-tl-xl dark:text-white">
                              Column
                            </th>
                            <th className="rounded-tr-xl dark:text-white">
                              Type
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {table.columns.map((col: any, k: number) => (
                            <tr key={k}>
                              <td className="text-ellipsis overflow-hidden max-w-[10px] text-[#7E7E7E] font-normal dark:text-white">
                                {col.name}
                              </td>
                              <td className="text-ellipsis overflow-hidden max-w-[10px] text-[#7E7E7E] font-normal dark:text-white">
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

                  {i !== tables.length - 1 && <div className="divider"></div>}
                </div>
              ))
            ) : (
              <div className="h-[100%] flex justify-center items-center">
                <p>No Tables</p>
              </div>
            )}

            {isMore && (
              <div className="h-20 w-full rounded-lg flex justify-center items-center">
                <button
                  className="w-[120px] btn btn-square bg-gradient-to-r from-[#0177e1] to-[#004cf7] border-none hover:from-[#004cf7]  hover:to-[#085da9] dark:text-white"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-16 items-center justify-center h-[10%]">
            <AiOutlineDatabase className="text-[35px]" />
          </div>
        )}
      {/* <div ref={messagesEndRef} /> */}


        {/* ************************************************************************** */}
      </aside>
      <div className="h-[5vh] flex justify-start items-center p-2 bg-[#E8F2FF]  dark:bg-[#0043A8] absolute bottom-0 w-[100%]">
        {rightSideBar ? (
          <AiOutlineDoubleRight
            className="text-[21px] text-[#004CF8] dark:text-white cursor-pointer"
            onClick={() => setRightSideBar(false)}
          />
        ) : (
          <AiOutlineDoubleLeft
            className="text-[21px] text-[#004CF8] dark:text-white cursor-pointer"
            onClick={() => setRightSideBar(true)}
          />
        )}
      </div>
    </div>
  );
};

export default RightPanel;
