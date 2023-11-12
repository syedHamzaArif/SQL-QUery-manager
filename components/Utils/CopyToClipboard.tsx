import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyToClipboardButton = ({
  text,
  reverse = false,
}: {
  text: string;
  reverse?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (copied) {
      intervalId = setInterval(() => {
        setCopied(false);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [copied]);

  return (
    <div className={`  ${reverse && "flex-row-reverse"} gap-4`}>
      <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
        <button className="btn btn-ghost">
          <span className="material-icons dark:text-black">content_copy</span>
        </button>
      </CopyToClipboard>

      <div>
        {copied ? (
          <span className="badge badge-[#0177E1] ml-2">Copied.</span>
        ) : null}
      </div>
    </div>
  );
};

export default CopyToClipboardButton;
