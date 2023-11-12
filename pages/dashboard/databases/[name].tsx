import { getSession } from "@auth0/nextjs-auth0";
import AllTables from "@components/Dashboard/Tables/AllTables";
import Pricing from "@components/Pricing";

import { collection, getDocs, query as firestoreQuery, where } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { db } from "../../../firebase/firebase";
import { setCurrent } from "../../../redux/reducers/databaseSlice";
import { verifySubscription } from "../../../utils/verifySubscription";

interface IProps {
  isActive: boolean;
  database: any;
  tables: any;
  edit: boolean | undefined;
  id:any,
  name:any,
}

const SingleDatabase = ({ isActive, database, tables,edit,id,name }: IProps) => {
  const dispatch = useDispatch();
  const [force, setForce] = React.useState(0);
  

  useEffect(() => {
    dispatch(setCurrent(database.id));
    setForce(1);
  }, [database]);

  useEffect(() => {
    dispatch(setCurrent(database.id))
  }, [])

  return (
    <>
      {isActive ? (
        <AllTables
        tables={tables}
        edit={edit}
        name={name}
        id={id}
        
        />
      ) : (
        <Pricing />
      )}
    </>
  );
};

export default SingleDatabase;

export const getServerSideProps = async ({
  req,
  res,
  params,
  query
}: GetServerSidePropsContext) => {
  const session = getSession(req, res);
  if (!session)
    return {
      props: {
        isActive: false,
      },
    };
  const id = session?.user.sub;
  const isActive = await verifySubscription(id);
  if (!isActive)
    return {
      props: {
        isActive,
      },
    };

  const name = params?.name;
  

  const databaseRef = collection(db, "users", id, "database");
  const q = firestoreQuery(databaseRef, where("name", "==", name));
  try {
    const databases = await getDocs(q);
    if (databases.docs.length === 0) return { notFound: true };
    const tableRef = collection(db, "users", id, "table");
    const databaseId = databases.docs[0].id;
    const q2 = firestoreQuery(tableRef, where("dbid", "==", databaseId));
    const tablesDocs = await getDocs(q2);
    const tables = tablesDocs.docs.map((table) => {
      const json: any = { ...table.data(), id: table.id };
      delete json.createdAt;
      delete json.updatedAt;
      return json;
    });
    return {
      props: {
        database: { ...databases.docs[0].data(), id: databaseId },
        tables,
        isActive,
        edit: query.edit ? query.edit : null,
        id,
        name,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { isActive },
    };
  }
};
