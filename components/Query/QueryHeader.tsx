import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  appendTables,
  resetTables,
  setCurrent,
  setTables,
} from "../../redux/reducers/databaseSlice";
import { RootState } from "../../redux/store";

interface Iprops {
  setPage: Dispatch<SetStateAction<number>>;
}

const QueryHeader = ({ setPage }: Iprops) => {
  const dispatch = useDispatch();
  const { all, current } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );



  // console.log("all===>",all)

  const [selectedValue, setSelectedValue] = useState<any>("");
  const [rightSideBar, setRightSideBar] = useState(false);

  const [isMore, setIsMore] = useState(true);

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
      <div className="w-[97.5%] h-[13vh] text-xl font-semibold p-4 rounded-lg mt-3 flex justify-between items-center bg-white dark:bg-[#2D2D2D]">
        <div className="flex items-center">
          <span className="material-icons pr-3">dashboard</span>
          <span>Query Playground</span>
        </div>

        <div className="flex items-center">
          {current && (
            <div className="form-control w-auto mx-auto my-4">
              <select
                className="select select-bordered bg-[#E8F2FF] dark:bg-[#2D2D2D] text-[#3b1d17] dark:text-white border border-[#3b1d17] dark:border-white w-[268px]"
                value={current.id}
                // value={selectedValue}
                onChange={(e) => {

                  dispatch(setCurrent(e.target.value));
                  dispatch(resetTables());
                  setPage(0);
                  // handleChange;
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
    </>
  );
};

export default QueryHeader;
