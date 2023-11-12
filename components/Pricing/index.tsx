// import { Tabs } from "flowbite-react";
import Image from "next/future/image";
import * as React from "react";
import Monthly from "./Monthly";
import Yearly from "./Yearly";
import pricing_icon from "../../public/newpictures/pricing_icon.png";
const Pricing = () => {
  const [showMonthly, setShowMonthly] = React.useState(false);

  return (
    <React.Fragment>
      <div>
        {/* <p className=" lg:text-[38px] text-[30px] mt-3 text-[#2D2D2D] font-[600] font-ibm leading-[57px] text-center">
          Simple Pricing
        </p> */}
        {/* <Image
          src={pricing_icon}
          width={100}
          height={15}
          alt="Vector"
          style={{ margin: "1rem auto" }}
        />
        <p className="text-[18px] text-[#7E7E7E] font-[400] leading-[26px] text-center w-[50%] m-auto font-roboto mb-2">
          For all type of users.
        </p> */}

        <div className="w-[100%]  flex justify-center my-10">
          <div className=" py-2 px-2 rounded-full bg-blue-100">
            <button
              className={`text-white font-roboto font-[500] py-2 px-10 text-sm  rounded-full  bg-blue-100    ${
                showMonthly
                  ? "bg-blue-600 text-white  "
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-black"
              }`}
              onClick={() => setShowMonthly(true)}
            >
              Monthly
            </button>
            <button
              className={`text-white font-roboto font-[500] py-2 px-10 text-sm  rounded-full  bg-blue-100    ${
                !showMonthly
                  ? "bg-blue-600 text-white "
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-black"
              }`}
              onClick={() => setShowMonthly(false)}
            >
              Yearly
            </button>
          </div>
        </div>
        {showMonthly ? <Monthly /> : <Yearly />}
      </div>
    </React.Fragment>
  );
};

export default Pricing;
