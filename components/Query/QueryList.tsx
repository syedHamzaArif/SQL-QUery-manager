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
  where,
} from "firebase/firestore";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase/firebase";
import { resetQuery, setQuery } from "../../redux/reducers/databaseSlice";
import { RootState } from "../../redux/store";
import QueryItem from "./QueryItem";
import { CgArrowAlignH } from "react-icons/cg";

interface Iprops {
  showQueries: boolean;
  currentQuery: boolean;
}

const QueryList = ({ showQueries, currentQuery }: Iprops) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const { current, queriesData } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const [empty, setEmpty] = useState(false);

  const updateState = async (collections: any) => {
    setLoading(true);
    const isCollectionEmpty = collections.size === 0;
    if (!isCollectionEmpty) {
      const docs = collections.docs.map((lists: any) => lists.data());
      const Lastdoc = collections.docs[collections.docs.length - 1];
      if (lastKey == null) {
        dispatch(resetQuery(docs));
      } else {
        dispatch(setQuery(docs));
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
    setLoading(true);
    const queryRef = collection(db, "users", `${user!.sub}`, "query");
    const doc =
      lastKey !== null
        ? query(
          queryRef,
          where("dbid", "==", current?.id),
          orderBy("createdAt", "desc"),
          startAfter(lastKey),
          limit(3)
        )
        : query(
          queryRef,
          where("dbid", "==", current?.id),
          orderBy("createdAt", "desc"),
          limit(6)
        );
    const response = await getDocs(doc);

    const queries = response.docs.map((qry) => ({ ...qry.data(), id: qry.id }));

    if (queries.length) {
      setEmpty(false);
      updateState(response);
    } else setEmpty(true);
  };

  const getQueries = async (isReset: any) => {
    const config = {
      method: "GET",
      url: "/api/queries/" + current?.id,
    };
    await axios(config)
      .then((response) => {
        if (response.data) {
          setEmpty(false);
          setLastKey(null);
          if (isReset) dispatch(resetQuery(response.data.queries));
          else dispatch(setQuery(response.data.queries));
        }
      })
      .catch((error) => {
        ErrorToast("Oops, something went wrong, please try again");
      });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [queriesData]);

  useEffect(() => {
    getQueries(true);
  }, [current?.id]);


  return (
    <Fragment>
      <div className="w-full h-full">
        {currentQuery && <QueryItem query={queriesData[0]} />}


        {showQueries &&
          queriesData &&
          queriesData.length > 0 &&
          [...queriesData].map((q: any, i: any) => {
            return <QueryItem key={i} query={q} />;
          })}



        <div className="top-to-btm"></div>

        {(!queriesData || queriesData.length === 0) && showQueries && (
          <div className="w-full flex justify-center items-center">
            <p>No Queries generated, yet!</p>
          </div>
        )}

        {queriesData && queriesData.length >= 3 && showQueries && !empty && (
          <div className="mt-2 flex justify-center">
            <button
              className={`w-[150px] btn btn-square bg-gradient-to-r from-[#e83864] to-[#3b1d17] border-none hover:from-[#3b1d17]  hover:to-[#a8072f] dark:text-white ${loading ? "loading" : ""
                }`}
              onClick={fetchMorePosts}
            >
              {loading ? "" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default QueryList;
