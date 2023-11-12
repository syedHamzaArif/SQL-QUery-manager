import { ErrorToast } from "@components/Toasts";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const AllData = () => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const axiosConfig = {
      url: "/api/me/delete",
      method: "delete",
    };
    try {
      await axios(axiosConfig);
      router.push("/api/auth/logout");
    } catch (error) {
      ErrorToast("Oops, something went wrong, please try again");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="">
        <ToastContainer />

        <h3 className="text-xl font-semibold">Danger Zone</h3>

        <div className="border border-error rounded-lg grid grid-cols-1 md:grid-cols-8 p-4 mt-8 gap-4 mr-6">
          <div className="md:col-span-6">
            <h5 className="text-lg font-semibold"> Delete All Data</h5>
            <p className="mt-2">Your all data will be lost.</p>
          </div>
          <label
            htmlFor="my-modal-second"
            className={`w-40 btn btn-error flex gap-2 items-center ${
              isDeleting && "loading"
            }`}
          >
            {!isDeleting && <span className="material-icons">delete</span>}{" "}
            Delete
          </label>
        </div>

        <input type="checkbox" className="modal-toggle" />
      </div>

      {/* delete modal */}
      <div className="py-5">
        <input type="checkbox" id="my-modal-second" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <div className="modal-action m-2">
              <label
                htmlFor="my-modal-second"
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                <span className="material-icons ">close</span>
              </label>
            </div>
            <p className="py-1 font-bold text-lg">
              Are you sure you want to delete all of your data?
            </p>
            <p className="py-2 mb-4">
              You will not be able to access this account and all your data with
              your subscription will be lost.
            </p>

            <button className="btn btn-success px-4">No</button>
            <button className="btn btn-error mx-4" onClick={handleDelete}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllData;
