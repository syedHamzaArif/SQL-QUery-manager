import AddNewDatabase from "@components/Databases/AddNewDatabase";
import axios from "axios";
import React, { useState } from "react";
import { AiOutlineDatabase } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateDB } from "../../../redux/reducers/databaseSlice";
import { RootState } from "../../../redux/store";
import { DB } from "../../../utils/types";

const AddNewDatabases = () => {
  // const { current } = useSelector(
  //   (state: RootState) => state.persistedReducer.userDatabases
  // );
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<DB["type"]>("PostgreSQL");
  // const dispatch = useDispatch();
  
  // const handleEditClick = (e: React.MouseEvent<HTMLElement>) => {
  //   e.preventDefault();
  //   setIsEdit(!isEdit);
  //   if (isEdit) {
  //     setName(current?.name || "");
  //     setType(current?.type || "PostgreSQL");
  //   }
  // };
  
  // const handleUpdateDBClick = async (e: React.MouseEvent<HTMLElement>) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   const axiosConfig = {
  //     method: "put",
  //     url: "/api/updateDb",
  //     data: { dbId: current?.id, name, type },
  //   };

  //   try {
  //     const res = await axios(axiosConfig);
  //     if (res.status === 200) {
  //       if (current?.id) dispatch(updateDB({ id: current.id, name, type }));
  //       setIsLoading(false);
  //       setIsEdit(!isEdit);
  //     }
  //   } catch (err: any) {
  //     if (err?.response?.data?.duplicate) {
  //       alert(err?.response?.data?.message);
  //     } else {
  //     }
  //     setIsLoading(false);
  //   }
  // };
  
  return (
    <>
      <div className="w-[98%] h-[13vh] text-xl font-semibold p-4 rounded-lg mt-3 flex justify-between items-center bg-white dark:bg-[#2D2D2D]">
        <div className="flex items-center">
          <AiOutlineDatabase className="text-[21px] mr-3" />
          <span>Databases</span>
        </div>
      </div>

      <AddNewDatabase
        name={name}
        setName={setName}
        type={type}
        setType={setType}
      />
     
    </>
  );
};

export default AddNewDatabases;
