import { useUser } from "@auth0/nextjs-auth0";
import { ErrorToast } from "@components/Toasts";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFeedback } from "../../redux/reducers/databaseSlice";
import { Query } from "../../utils/types";
import { CopyToClipboardButton } from "../Utils";
import { CgArrowAlignH } from "react-icons/cg";

type Props = {
  query: Query;
};

const QueryItem = ({ query }: Props) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const [loadingFeedback, setLoadingFeedback] = useState({
    correct: false,
    wrong: false,
  });

  const handleFeedbackSubmit = async (isCorrect: boolean) => {
    try {
      setLoadingFeedbackState(isCorrect, true);
      if (isCorrect) {
        await axios.post("/api/feedback", {
          isCorrect: true,
          id: query.id,
          uid: user?.sub,
          operation: "generate",
        });
        dispatch(addFeedback({ queryId: query.id, isCorrect }));
      } else {
        await axios.post("/api/feedback", {
          isCorrect: false,
          id: query.id,
          uid: user?.sub,
          operation: "generate",
        });
        dispatch(addFeedback({ queryId: query.id, isCorrect }));
        setLoadingFeedbackState(isCorrect, false);
      }
      console.log("====>", query.id);
    } catch (error) {
      ErrorToast(`Error submitting feedback : ${error}`);
      setLoadingFeedbackState(isCorrect, false);
    }
  };

  const setLoadingFeedbackState = (isCorrect: boolean, loading: boolean) => {
    if (isCorrect) setLoadingFeedback({ ...loadingFeedback, correct: loading });
    else setLoadingFeedback({ ...loadingFeedback, wrong: loading });
  };

  // for bottom to top scroll

  return (
    <>
      {query && (
        <div className=" rounded-xl w-[100%]">
          <div className="flex items-center justify-between">
            <div className="my-4 mt-6">
              <p className="px-2 text-[14px] mx-4 font-semibold text-black capitalize dark:text-white ">
                Prompt:
              </p>
              <p className="px-2 mt-2 text-[14px] mx-4 font-semibold text-black capitalize dark:text-white ">
                {query?.prompt}
              </p>
            </div>
          </div>

          <p className="px-2 text-[14px] mx-4 mt-4 font-semibold text-black capitalize dark:text-white ">
            Result:
          </p>
          <div className="mx-4 rounded-xl bg-[#E5E5E6] mt-3 ">
            <textarea
              className="w-full min-h-[21rem] whitespace-pre-wrap textarea    textarea-bordered border-none resize-none textarea-disabled bg-white overflow-y-auto "
              disabled
              value={"\n" + query?.response && query?.response.trim()}
            >
              {query?.response}
            </textarea>
            <div className="flex justify-between">
              <div>
                {query?.isCorrect == null && (
                  <div className="flex gap-4 items-center mt-4 mx-4 mb-4 px-2">
                    <p className="font-semibold dark:text-black">
                      Is the output correct?
                    </p>
                    <span
                      className={` text-[#36D36A] text-[8px] cursor-pointer ${
                        loadingFeedback.correct && "loading"
                      }`}
                      onClick={() => handleFeedbackSubmit(true)}
                    >
                      {!loadingFeedback.correct && (
                        <span className="material-icons cursor-pointer">
                          check
                        </span>
                      )}
                    </span>
                    <span
                      className={` text-[#D81616] text-[8px] cursor-pointer ${
                        loadingFeedback.wrong && "loading"
                      }`}
                      onClick={() => handleFeedbackSubmit(false)}
                    >
                      {!loadingFeedback.wrong && (
                        <span className="material-icons cursor-pointer">
                          close
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <CopyToClipboardButton
                  text={query?.response.trim()}
                  reverse={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QueryItem;
