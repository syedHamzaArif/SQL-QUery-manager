import { useUser } from "@auth0/nextjs-auth0";
import { ErrorToast } from "@components/Toasts";
import axios from "axios";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { DOMAttributes, RefObject, useRef, useState } from "react";
import {
  AiOutlineArrowUp,
  AiOutlineConsoleSql,
  AiOutlineHistory,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { db } from "../../firebase/firebase";
import {
  addFeedback,
  resetExplain,
  setExplain,
} from "../../redux/reducers/databaseSlice";
import { CopyToClipboardButton } from "../Utils";

const QueryExplain = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const [code, setCode] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [singlePrompt, setSinglePrompt] = useState<string>("");
  const [id, setId] = useState<string>("");

  const [queryExplanationData, setQueryExplanationData] = useState<any>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState({
    correct: false,
    wrong: false,
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = async (
    e: any
  ) => {
    e.preventDefault();
    setFeedbackSubmitted(false);
    setLoading(true);
    const axiosConfig = {
      url: "/api/playground",
      method: "post",
      data: {
        intent: "explain",
        query: code,
      },
    };
    try {
      const { data } = await axios(axiosConfig);
      setText(data.response);
      setSinglePrompt(code);
      setQueryExplanationData((prev: any) => [
        data.response,
        ...queryExplanationData,
      ]);
      setId(data.id);
      setCode("");
      setShowExplanation(false);
    } catch (error: any) {
      if (error.response.status === 429)
        ErrorToast("Too many requests, please try again");
      else ErrorToast("Error submitting query");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (
    isCorrect: boolean,
    resultId: string,
    resultIndex?: number
  ) => {
    try {
      setLoadingFeedbackState(isCorrect, true);
      if (isCorrect) {
        await axios.post("/api/feedback", {
          isCorrect: true,
          id: resultId,
          uid: user?.sub,
          operation: "explain",
        });
        resultIndex &&
          setQueryExplanationData((prev: any) =>
            prev.map((item: any, index: number) =>
              index === resultIndex ? { ...item, isCorrect: true } : item
            )
          );
        dispatch(addFeedback({ queryId: resultId, isCorrect }));
      } else {
        await axios.post("/api/feedback", {
          isCorrect: false,
          id: resultId,
          uid: user?.sub,
          operation: "explain",
        });
        resultIndex &&
          setQueryExplanationData((prev: any) =>
            prev.map((item: any, index: number) =>
              index === resultIndex ? { ...item, isCorrect: false } : item
            )
          );
        dispatch(addFeedback({ queryId: resultId, isCorrect }));
      }
      setFeedbackSubmitted(true);
      setLoadingFeedbackState(isCorrect, false);
    } catch (error) {
      ErrorToast(`Error submitting feedback : ${error}`);
      setLoadingFeedbackState(isCorrect, false);
    }
  };

  const setLoadingFeedbackState = (isCorrect: boolean, loading: boolean) => {
    if (isCorrect) setLoadingFeedback({ ...loadingFeedback, correct: loading });
    else setLoadingFeedback({ ...loadingFeedback, wrong: loading });
  };

  const updateState = async (collections: any) => {
    setLoading(true);
    const isCollectionEmpty = collections.size === 0;
    if (!isCollectionEmpty) {
      const docs = collections.docs.map((lists: any) => lists.data());
      const Lastdoc = collections.docs[collections.docs.length - 1];
      if (lastKey == null) {
        dispatch(resetExplain(docs));
      } else {
        dispatch(setExplain(docs));
        if (collections.size != 3) {
          setEmpty(true);
        }
      }
      setLastKey(Lastdoc);
    } else {
      setEmpty(true);
    }
    setLoading(false);
  };

  const fetchMorePosts = async () => {
    try {
      setLoading(true);
      const queryRef = collection(db, "users", `${user!.sub}`, "explain");
      const doc =
        lastKey !== null
          ? query(
            queryRef,
            // where("id", "==", current?.id),
            orderBy("createdAt", "desc"),
            startAfter(lastKey),
            limit(3)
          )
          : query(
            queryRef,
            // where("id"),
            orderBy("createdAt", "desc"),
            limit(6)
          );

      const response = await getDocs(doc);

      const queries = response.docs.map((qry) => ({
        ...qry.data(),
        id: qry.id,
      }));
      const Lastdoc = response.docs[response.docs.length - 1];
      // setLastKey(Lastdoc)
      setQueryExplanationData((state: any) => [...state, ...queries]);
      setLoading(false);
      if (queries.length) {
        setEmpty(false);
        updateState(response);
      } else setEmpty(true);
    } catch (error) { }
  };

  const getExplanations = async () => {
    const axiosConfig = {
      url: "/api/explanations",
      method: "get",
    };
    try {
      const { data } = await axios(axiosConfig);
      setQueryExplanationData(data.queries);
      setShowExplanation(!showExplanation);
    } catch (error: any) {
      ErrorToast("Error fetching explanations");
    }
  };

  const divRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const scrollToTop = (): void => {
    divRef?.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="w-[98%] px-3 h-[13vh] text-xl font-semibold rounded-lg mt-3  flex justify-between items-center bg-white dark:bg-[#2D2D2D]">
        <div className="flex items-center">
          <AiOutlineConsoleSql className="text-[21px] mr-3" />
          <span>Explain SQL</span>
        </div>
      </div>



      <div className=" w-[98%] h-[89vh] pb-10 bg-white dark:bg-[#2D2D2D] mt-5 rounded-lg px-5 py-4 ">
        <div className="flex items-center justify-end  my-4">
          <div className="icon with text history flex items-center pr-[22px]">
            <AiOutlineHistory className="mr-2" />
            <p
              className="text-[#3b1d17] dark:text-white text-[15px] font-semibold cursor-pointer"
              onClick={getExplanations}
            >
              History
            </p>
          </div>
        </div>

        <div
          className="h-[70vh] w-full scrollbar-thin scrollbar-thumb-base-200 overflow-y-scroll overflow-x-hidden scrollbar-thumb-rounded-full scrollbar-track-rounded-full px-8 pb-20 lg:pb-0 lg:px-0 !pr-[20px]"
          ref={divRef}
        >
          <form className="form-control" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <textarea
                className="textarea-xm textarea focus:outline-none textarea-bordered bg-white border-[2px] border-textPrimary  ml-2 p-4 rounded-xl border-[#3b1d17] text-[#7E7E7E] dark:bg-[#2D2D2D] dark:text-[#E2E2E2] dark:border-white w-full"
                placeholder="Paste some SQL to generate explanation"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <button
                className={`btn btn-square  bg-gradient-to-r from-[#e83864] to-[#3b1d17] border-none hover:from-[#3b1d17]  hover:to-[#a8072f] dark:text-white ${loading && "loading"
                  }`}
                type="submit"
              >
                {!loading && (
                  <span className="flex items-center gap-4">
                    <span className="material-icons">send</span>
                  </span>
                )}
              </button>
            </div>
          </form>

          {showExplanation ? (
            <div className="">
              {queryExplanationData.map((q: any, index: number) => (
                <div className="  rounded-xl  w-full" key={index}>
                  <div className=" my-4 mt-6">
                    <p className=" text-[14px] mx-4 font-semibold text-black capitalize dark:text-white ">
                      Prompt:
                    </p>
                    <p className=" mt-2 text-[14px] mx-4 font-semibold text-black capitalize dark:text-white ">
                      {q?.prompt}
                    </p>
                  </div>

                  <div className=" my-4 mt-8">
                    <p className=" text-[14px] mx-4 font-semibold text-black capitalize dark:text-white ">
                      Explanation:
                    </p>
                  </div>

                  <div className="mx-2 rounded-xl bg-[#E5E5E6] mt-3">
                    <textarea
                      className="w-full min-h-[20rem] whitespace-pre-wrap textarea  textarea-bordered border-none resize-none textarea-disabled bg-white"
                      disabled
                      value={q.response.trim()}
                      readOnly
                    />

                    <div className="flex justify-between">
                      <div>
                        {q.isCorrect === undefined && (
                          <div className="flex gap-4 items-center mx-3 mt-3 mb-4">
                            <p className="font-semibold text-[15px] dark:text-black">
                              Is the output correct?
                            </p>
                            <span
                              className={` text-[#36D36A] text-[8px] cursor-pointer ${loadingFeedback.correct && "loading"
                                }`}
                              onClick={() =>
                                handleFeedbackSubmit(true, q.id, index)
                              }
                            >
                              {!loadingFeedback.correct && (
                                <span className="material-icons">check</span>
                              )}
                            </span>
                            <span
                              className={` cursor-pointer text-[#D81616] text-[8px] ${loadingFeedback.wrong && "loading"
                                }`}
                              onClick={() =>
                                handleFeedbackSubmit(false, q.id, index)
                              }
                            >
                              {!loadingFeedback.wrong && (
                                <span className="material-icons">close</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <CopyToClipboardButton text={q.response} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {text && (
                <div className="  rounded-xl  w-full">
                  <div className=" my-4 mt-6">
                    <p className=" text-[14px] mx-4 font-semibold text-black capitalize dark:text-white ">
                      Prompt:
                    </p>
                    <p className=" mt-2 text-[14px] mx-4 font-semibold text-black capitalize dark:text-white ">
                      {singlePrompt}
                    </p>
                  </div>

                  <div className=" my-4 mt-8">
                    <p className=" text-[14px] mx-4 font-semibold text-black capitalize dark:text-white ">
                      Explanation:
                    </p>
                  </div>

                  <div className="mx-2 rounded-xl bg-[#E5E5E6] mt-3">
                    <textarea
                      className="w-full min-h-[20rem] whitespace-pre-wrap textarea  textarea-bordered border-none resize-none textarea-disabled bg-white"
                      disabled
                      value={text.trim()}
                      readOnly
                    ></textarea>
                    <div className="flex justify-between">
                      <div>
                        {!feedbackSubmitted && (
                          <div className="flex gap-4 items-center mt-4 mx-3 mb-4">
                            <p className="font-semibold text-[15px] dark:text-black">
                              Is the output correct?
                            </p>
                            <span
                              className={` text-[#36D36A] text-[8px] cursor-pointer ${loadingFeedback.correct && "loading"
                                }`}
                              onClick={() => handleFeedbackSubmit(true, id)}
                            >
                              {!loadingFeedback.correct && (
                                <span className="material-icons">check</span>
                              )}
                            </span>
                            <span
                              className={` text-[#D81616] text-[8px] cursor-pointer ${loadingFeedback.wrong && "loading"
                                }`}
                              onClick={() => handleFeedbackSubmit(false, id)}
                            >
                              {!loadingFeedback.wrong && (
                                <span className="material-icons">close</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <CopyToClipboardButton text={text} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {queryExplanationData &&
          queryExplanationData.length >= 3 &&
          !empty &&
          showExplanation && (
            <div className="mt-2 flex justify-center">
              <button
                className={`w-40 btn btn-square bg-gradient-to-r from-[#e83864] to-[#3b1d17] border-none hover:from-[#3b1d17]  hover:to-[#a8072f] dark:text-white${loading ? "loading" : ""
                  }`}
                onClick={fetchMorePosts}
              >
                {loading ? "" : "Show More"}
              </button>
            </div>
          )}
      </div>

      {showExplanation && (
        <div className="relative">
          <button
            className="absolute right-5 bottom-5 bg-gradient-to-r from-[#e83864] to-[#3b1d17] border-none hover:from-[#3b1d17]  hover:to-[#a8072f] p-3 rounded-full text-white font-bold text-[20px]"
            type="button"
            onClick={() => scrollToTop()}
          >
            <AiOutlineArrowUp />
          </button>
        </div>
      )}
    </>
  );
};

export default QueryExplain;
