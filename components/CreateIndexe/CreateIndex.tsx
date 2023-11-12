import { useUser } from "@auth0/nextjs-auth0";
import { ErrorToast } from "@components/Toasts";
import { CopyToClipboardButton } from "@components/Utils";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";

const CreateIndex = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>();
  const [text, setText] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState({
    correct: false,
    wrong: false,
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = async (isCorrect: boolean) => {};
  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const axiosConfig = {
      url: "/api/playground",
      method: "post",
      data: {
        query: value,
        intent: "index",
      },
    };
    try {
      setLoading(true);
      const { data } = await axios(axiosConfig);
      setText(data.text);
      setFeedbackSubmitted(false);
    } catch (error) {
      ErrorToast("Oops, something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="py-5 pr-5">
        <form className="form-control">
          <h3 className="text-xl font-semibold mb-5">
            Enter SQL Query Code Below to create indexes
          </h3>

          <textarea
            className="textarea textarea-bordered h-24 ml-2"
            placeholder="SELECT * FROM AI"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          ></textarea>
          <button
            className={`btn btn-success mx-2 my-5 w-60 ${loading && "loading"}`}
            type="submit"
            onClick={handleSubmit}
          >
            {!loading && (
              <span className="flex items-center gap-4">
                Explain SQL <span className="material-icons">send</span>
              </span>
            )}
          </button>
        </form>

        <h3 className="text-xl font-semibold mb-5">Result</h3>
        {text ? (
          <div className="p-4 rounded-xl bg-base-200">
            <textarea
              className="mb-4 w-full min-h-[20rem] whitespace-pre-wrap textarea textarea-bordered textarea-disabled"
              disabled
              value={text}
              readOnly
            ></textarea>
            <CopyToClipboardButton text={text} />

            {!feedbackSubmitted && (
              <div className="flex gap-4 items-center mt-4">
                <p className="font-semibold">Is the output correct?</p>
                <button
                  className={`btn btn-success btn-sm btn-circle ${
                    loadingFeedback.correct && "loading"
                  }`}
                  onClick={() => handleFeedbackSubmit(true)}
                >
                  {!loadingFeedback.correct && (
                    <span className="material-icons">thumb_up</span>
                  )}
                </button>
                <button
                  className={`btn btn-error btn-sm btn-circle ${
                    loadingFeedback.wrong && "loading"
                  }`}
                  onClick={() => handleFeedbackSubmit(false)}
                >
                  {!loadingFeedback.wrong && (
                    <span className="material-icons">thumb_down</span>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-base-200">
            <p>Paste some SQL above and generate indexes</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateIndex;
