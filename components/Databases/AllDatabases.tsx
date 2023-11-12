import { useUser } from "@auth0/nextjs-auth0";
import { ErrorToast, SuccessToast } from "@components/Toasts";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Circles } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { deleteDB, setCurrent } from "../../redux/reducers/databaseSlice";
import { RootState } from "../../redux/store";
import { DB } from "../../utils/types";
const AllDatabases = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useUser();
  const [deleteInput, setDeleteInput] = React.useState<string>("");
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [toDelete, setToDelete] = React.useState<DB | null>(null);
  const [show, setShow] = useState(false);

  const { all, current, isNew } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  const [loader, setLoader] = React.useState(false);

  const handleDeleteDatabase = async () => {
    if (toDelete?.id === "demo-db") {
      ErrorToast("You cannot delete the Demo database");
      return;
    }
    setIsDeleting(true);
    const axiosConfig = {
      method: "post",
      url: "/api/deleteDb",
      data: {
        uid: user?.sub,
        dbid: toDelete?.id,
      },
    };

    try {
      await axios(axiosConfig);
      dispatch(deleteDB(toDelete?.id as string));
      setDeleteInput("");
      setShow(false);

      SuccessToast("Database deleted");
    } catch (error) {
      setDeleteInput("");
      ErrorToast("Database was not deleted");
    } finally {
      setIsDeleting(false);
    }
  };

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
      <div className="w-[98%] h-[89vh] pb-10 bg-white dark:bg-[#2D2D2D] mt-5 rounded-lg px-5 py-4">
        <div className="">
          {current && !isNew && (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-3">
              {sort().map((db, i) => (
                <React.Fragment key={db.name + i}>
                  <div className="border border-[#0177E1] dark:border-white w-[100%] h-[100%] rounded-xl py-4 px-3 flex justify-between">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setLoader(true);
                        dispatch(setCurrent(db.id));
                        router.push(`/dashboard/databases/${db.name}`);
                      }}
                    >
                      <p className="text-[#7E7E7E] dark:text-white capitalize ">
                        <span className="text-ellipsis overflow-hidden max-w-[10px] text-black dark:text-white text-[16px] tracking-wide font-medium mr-1 ">
                          Name:
                        </span>
                        {db.name}
                      </p>
                      <p className="text-[#7E7E7E] dark:text-white capitalize">
                        <span className="text-ellipsis overflow-hidden max-w-[10px] text-black dark:text-white text-[16px] tracking-wide font-medium mr-1 ">
                          Type:
                        </span>
                        {db.type}
                      </p>
                      <p className="text-[#7E7E7E] dark:text-white capitalize">
                        <span className="text-ellipsis overflow-hidden max-w-[10px] normal-case text-black dark:text-white text-[16px] tracking-wide font-medium mr-1 ">
                          No of Tables:
                        </span>
                        {db.tables}
                      </p>
                    </div>

                    {db.name !== "Demo" && (
                      <div
                        className="cursor-pointer"
                        onClick={() => setToDelete(db)}
                      >
                        <div className="flex">
                          <label>
                            <FiEdit
                              onClick={() => {
                                setLoader(true);
                                dispatch(setCurrent(db.id));
                                router.push(
                                  `/dashboard/databases/${db.name}?edit=true`
                                );
                              }}
                              className="cursor-pointer mr-1"
                            />
                          </label>

                          <label onClick={() => setShow(true)}>
                            <RiDeleteBin6Line className="cursor-pointer" />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        {loader && (
          <div className=" flex justify-center items-center mb-20 relative top-[7px] left-[0px]">
            <Circles
              height="30"
              width="30"
              color="#004CF7"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
      </div>

      <div className={`modal ${show ? "modal-open" : ""}`}>
        <div className="modal-box">
          <label
            // htmlFor={`delete-${toDelete?.name}`}
            onClick={() => {
              setShow(false);
            }}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            <span className="material-icons">close</span>
          </label>
          <h3 className="font-bold text-lg">
            Are you sure you want to delete {toDelete?.name}?
          </h3>
          <p className="py-2 flex">You won&apos;t be able to revert this!</p>

          <p className="py-4">
            Type <b>{toDelete?.name}</b> below to confirm deletion
          </p>
          <div className="modal-action w-full">
            <input
              type="text"
              className="input input-bordered w-full"
              onChange={(e) => setDeleteInput(e.target.value)}
              value={deleteInput}
              autoFocus
            />
            <button
              className="btn bg-gradient-to-r from-[#0177e1] to-[#004cf7] hover:from-[#004cf7]  hover:to-[#085da9] border-none cursor-pointer text-white"
              onClick={handleDeleteDatabase}
              disabled={deleteInput !== toDelete?.name}
            >
              <label
                className="cursor-pointer"
                htmlFor={` delete-${toDelete?.name}`}
              >
                Delete
              </label>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllDatabases;
