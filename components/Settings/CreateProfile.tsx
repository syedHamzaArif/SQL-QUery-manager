import { useUser } from "@auth0/nextjs-auth0";
import { ErrorToast } from "@components/Toasts";
import axios from "axios";
import { useState } from "react";

const CreateProfile = () => {
  const { user } = useUser();
  const [name, setName] = useState<string>(user?.name ? user.name : '');

  // const handleUpdateProfile = async () => {
  //   if(name === '') {
  //     ErrorToast("Name cannot be empty");
  //     return;
  //   }
  //   const axiosConfig = {
  //     url: "/api/me/update",
  //     method: "patch",
  //     data: {
  //       name,
  //     }
  //   };
  //   try {
  //     await axios(axiosConfig);
  //   } catch (error: any) {
  //     ErrorToast(error?.response?.data?.message);
  //   }
  // };

  return (
    <div className="flex flex-col justify-between ">
      <div>
        <p className="text-[#2D2D2D] text-[25px] font-[500] dark:text-white">
          Profile
        </p>
        <div className="border-t border-t-[#3b1d17] dark:border-t-white  mt-2"></div>

        <div className="w-[50%] flex flex-col gap-4 mt-5">
          <div className="w-[50%]">
            <p className="text-[#7E7E7E] dark:text-white font-[400] text-[16px] mb-1">
              Name
            </p>
            <input
              className=" bg-white p-4 rounded-xl border text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full h-10"
              placeholder="John"
              value={name}
              required
              onChange={(e: any) => setName(e.target.value)}
              disabled
            />
          </div>
          <div className="w-[50%]">
            <p className="text-[#7E7E7E] dark:text-white font-[400] text-[16px] mb-1">
              Email
            </p>
            <input
              className=" bg-white p-4 rounded-xl border text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full h-10"
              placeholder="john@example.com"
              required
              value={user?.email ? user.email : ''}
              disabled
            />
          </div>
        </div>
      </div>
      {/* <div>
        <button onClick={handleUpdateProfile} className="w-[114px] h-[40px] rounded bg-gradient-to-r from-[#e83864] to-[#3b1d17] hover:from-[#3b1d17]  hover:to-[#a8072f] text-white text-[14px] font-[400]">
          Update Profile
        </button>
      </div> */}
    </div>
  );
};

export default CreateProfile;
