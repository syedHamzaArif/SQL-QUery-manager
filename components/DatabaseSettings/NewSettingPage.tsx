import React from "react";
import { FiSettings } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setDarkModeTheme } from "../../redux/reducers/darkModeSlice";
import { RootState } from "../../redux/store";

const NewSettingPage = () => {
  const dispatch = useDispatch();

  const newTheme = useSelector(
    (state: RootState) => state.persistedReducer.darkmode.theme
  );

  const handleTheme = () => {
    dispatch(setDarkModeTheme(newTheme === "light" ? "light" : "dark"));
  };
  return (
    <>
      <div className="w-[98%] h-[88px] text-xl font-semibold	p-4 rounded-lg mt-3  flex justify-between items-center bg-white dark:bg-[#2D2D2D]">
        <div className="flex items-center">
          <FiSettings className="text-[21px] mr-3" />

          <span>Settings</span>
        </div>

        <div className="flex items-center">
          <span className="material-icons text-3xl " onClick={handleTheme}>
            dark_mode
          </span>
        </div>
      </div>

      <div className=" w-[98%] h-[90%] pb-10 bg-white dark:bg-[#2D2D2D] mt-5 rounded-lg px-5 py-4">

    


      </div>
    </>
  );
};

export default NewSettingPage;
