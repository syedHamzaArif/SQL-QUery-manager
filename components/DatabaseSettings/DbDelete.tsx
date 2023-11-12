import { useUser } from "@auth0/nextjs-auth0";
import { deleteDB } from "../../redux/reducers/databaseSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const DbDelete = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { current, tables } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  const [deleteInput, setDeleteInput] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteDatabase = async () => {
    setIsDeleting(true);

    const axiosConfig = {
      method: "post",
      url: "/api/deleteDb",
      data: {
        uid: user?.sub,
        dbid: current?.id,
      },
    };

    try {
      await axios(axiosConfig);
      dispatch(deleteDB(current?.id as string));
      setIsDeleting(false);
      setDeleteInput("");
    } catch (error) {
      setIsDeleting(false);
      setDeleteInput("");
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold">Danger Zone</h3>

      <div className="border border-error rounded-lg grid grid-cols-1 md:grid-cols-8 p-4 mt-8 gap-4">
        <div className="md:col-span-6">
          <h5 className="text-lg font-semibold">
            Delete {current?.name} database
          </h5>
          <p className="mt-2">
            Delete the database and all the data associated with it
          </p>
        </div>
        <label
          htmlFor={`delete-${current?.name}`}
          className={`w-40 btn btn-error flex gap-2 items-center ${
            isDeleting && "loading"
          }`}
        >
          {!isDeleting && <span className="material-icons">delete</span>} Delete
        </label>
      </div>

      <input
        type="checkbox"
        id={`delete-${current?.name}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <label
            htmlFor={`delete-${current?.name}`}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            <span className="material-icons">close</span>
          </label>
          <h3 className="font-bold text-lg">
            Are you sure you want to delete {current?.name}?
          </h3>
          <p className="py-4">
            Type {current?.name} below to confirm deletion (this process is not
            reversible)
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
              className="btn btn-error"
              onClick={handleDeleteDatabase}
              disabled={deleteInput !== current?.name}
            >
              <label htmlFor={`delete-${current?.name}`}>Delete</label>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DbDelete;
