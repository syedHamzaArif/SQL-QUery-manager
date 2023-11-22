import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import { Dispatch, DOMAttributes, SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addQuery } from "../../redux/reducers/databaseSlice";
import { QueryType } from "../../utils/types";
import { ErrorToast } from "@components/Toasts";

interface IProps {
  intent: string;
  setCurrentQuery: Dispatch<SetStateAction<boolean>>;
  setShowQueries: Dispatch<SetStateAction<boolean>>;
}

const QueryInput = ({ intent, setCurrentQuery, setShowQueries }: IProps) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { current, tables } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = async (
    e
  ) => {
    setLoading(true);
    e.preventDefault();

    const axiosConfig = {
      url: "/api/playground",
      method: "post",
      data: {
        intent,
        query: input,
        dbid: current?.id,
        tables,
      },
    };
    try {
      const { data } = await axios(axiosConfig);
      dispatch(
        addQuery({
          id: data.id,
          prompt: input,
          operation: intent,
          response: data.response,
          createdAt: data.createdAt,
        })
      );
      setInput("");
      setShowQueries(false);
    } catch (error: any) {
      ErrorToast(error.response.data.message);
    } finally {
      setLoading(false);
      setCurrentQuery(true);
    }
  };

  return (
    <>
      <div className="flex flex-col ">
        {/* {isFocused && (
          <p className="text-warning-content mx-2 mr-0 bg-warning p-4 rounded-lg mb-5">
            To ensure best results, add the table(s) you want to query and
            mention the column names as well
          </p>
        )} */}

        <form onSubmit={handleSubmit} className="w-full">
          <span className="flex gap-4">
            <textarea
              placeholder="Query prompt..."
              className="textarea-xm textarea focus:outline-none textarea-bordered bg-white border-[2px] border-textPrimary  ml-2 p-4 rounded-xl border-[#3b1d17 ] text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={(e) => setIsFocused(true)}
              onBlur={(e) => setIsFocused(false)}
              required
            />

            <button
              type="submit"
              className={`btn btn-square bg-gradient-to-r from-[#e83864 ] to-[#3b1d17 ] border-none hover:from-[#3b1d17 ]  hover:to-[#a8072f] ${loading && "loading"
                }`}
            >
              {!loading && (
                <span className="material-icons text-white">send</span>
              )}
            </button>
          </span>
        </form>
      </div>
    </>
  );
};

export default QueryInput;
