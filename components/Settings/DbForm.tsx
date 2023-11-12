import { useUser } from "@auth0/nextjs-auth0";
import { ErrorToast } from "@components/Toasts";
import axios from "axios";
import { FC, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  mariaDBParser,
  msSQLServerParser,
  mySQLParser,
  postgreSQLParser
} from "../../parser";
import {
  addDB, deleteDB, setCurrent,
  setIsNew,
  updateDB
} from "../../redux/reducers/databaseSlice";
import { RootState } from "../../redux/store";
import { DB, ParsedJSON } from "../../utils/types";

interface IProps {
  setScriptData(param: ParsedJSON): void;
}

const DbForm = ({ setScriptData }: IProps) => {
  const { isNew } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  return (
    <Fragment>
      {isNew ? (
        <AddDB setScriptData={setScriptData}></AddDB>
      ) : (
        <EditDB></EditDB>
      )}
    </Fragment>
  );
};

type DBProp = {
  children?: React.ReactElement<ImportProp>;
  isEdit?: boolean;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  type: DB["type"];
  setType: React.Dispatch<React.SetStateAction<DB["type"]>>;
};

const DBFields: FC<DBProp> = ({
  children,
  isEdit,
  name,
  setName,
  type,
  setType,
}) => {
  return (
    <Fragment>
      <form className="mt-4 pr-4 items-center  auto-rows-max">
        <div className="form-control  col-span-2 mb-4 md:mb-0">
          <label className="input-group">
            <span className="label-text">Name</span>
            <input
              type="text"
              className="input input-bordered "
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEdit && !children}
              autoFocus
            />
          </label>
        </div>
        <div className="form-control  mt-3">
          <label className="input-group">
            <span className="label-text">Type</span>
            <select
              className="select select-bordered"
              value={type}
              onChange={(e) => setType(e.target.value as DB["type"])}
              disabled={!isEdit && !children}
            >
              <option>PostgreSQL</option>
              <option>MySQL</option>
              <option>MariaDB</option>
              <option>SQL Server</option>
            </select>
          </label>
        </div>
        {children}
      </form>
    </Fragment>
  );
};

const EditDB = () => {
  const { current } = useSelector(
    (state: RootState) => state.persistedReducer.userDatabases
  );
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<DB["type"]>("PostgreSQL");
  const dispatch = useDispatch();

  useEffect(() => {
    setName(current?.name || "");
    setType(current?.type || "PostgreSQL");
  }, [current]);

  const handleEditClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsEdit(!isEdit);
    if (isEdit) {
      setName(current?.name || "");
      setType(current?.type || "PostgreSQL");
    }
  };

  const handleUpdateDBClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const axiosConfig = {
      method: "put",
      url: "/api/updateDb",
      data: { dbId: current?.id, name, type },
    };

    try {
      const res = await axios(axiosConfig);
      if (res.status === 200) {
        if (current?.id) dispatch(updateDB({ id: current.id, name, type }));
        setIsLoading(false);
        setIsEdit(!isEdit);
      }
    } catch (err: any) {
      if (err?.response?.data?.duplicate) {
        ErrorToast(err?.response?.data?.message);
      } else {
      }
      setIsLoading(false);
    }
  };


  return (
    <Fragment>
      <div className="flex gap-10 items-center mt-5">
        <h3 className="text-lg font-semibold">General Information</h3>
        <div className="flex gap-2">
          <button
            className={`btn btn-circle btn-sm ${
              isEdit ? "btn-error" : "btn-warning"
            }`}
            onClick={handleEditClick}
            disabled={current?.id === "demo-db"}
          >
            <span className="material-icons">{isEdit ? "close" : "edit"}</span>
          </button>

          {isEdit && (
            <Fragment>
              <label
                className={`btn btn-circle btn-sm btn-success ${
                  isLoading && "loading"
                }`}
                onClick={handleUpdateDBClick}
              >
                {!isLoading && <span className="material-icons">done</span>}
              </label>
            </Fragment>
          )}
        </div>
      </div>

      <DBFields
        isEdit={isEdit}
        name={name}
        setName={setName}
        type={type}
        setType={setType}
      />
    </Fragment>
  );
};

type AddDBProp = {
  setScriptData(param: ParsedJSON): void;
};


const AddDB: FC<AddDBProp> = ({ setScriptData }) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<DB["type"]>("PostgreSQL");
  const [script, setScript] = useState<string>("");

  const handleCreateDB = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLoading(true);
    createDatabase();
  };

  const handleImportFromScript = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let jsoned = null;

    try {
      switch (type) {
        case "PostgreSQL":
          jsoned = postgreSQLParser(script);
          break;
        case "MySQL":
          jsoned = mySQLParser(script);
          break;
        case "MariaDB":
          jsoned = mariaDBParser(script);
          break;
        case "SQL Server":
          jsoned = msSQLServerParser(script);
          break;
      }
      if (Object.keys(jsoned).length === 0) {
        setIsLoading(false);
        return ErrorToast("No CREATE statements found in the import script");
      } else createDatabase(jsoned);
    } catch (error) {
      setIsLoading(false);
      return ErrorToast(
        " Import script is not valid"
      );
    }
  };

  const deleteDb = async () => {
    const axiosConfig = {
      method: "post",
      url: "/api/deleteDbByName",
      data: {
        uid: user?.sub,
        dbName: name,
      },
    };
    try {
      const res = await axios(axiosConfig);
      if (res?.data?.success) {
        dispatch(deleteDB(res?.data?.dbId as string));
        return true
      }
    } catch (error) {
      return false;
    }
  };

  const createDatabase = (jsoned?: ParsedJSON | null) => {
    const id = uuidv4();
    axios
      .post("/api/setDb", { db: { name, type, id }, uid: user?.sub })
      .then((res) => {
        if (res.status === 200) {
          dispatch(addDB({ id, name, type }));
          dispatch(setCurrent(id));
          dispatch(setIsNew(false));
          setIsLoading(false);
          if (jsoned) {
            setScriptData(jsoned);
            setScript("");
          }
        }
      })
      .catch(async (err) => {
        if (err.response.data.code === "ALREADY EXISTS") {
          const res = confirm(
            "A database exists with the same name. Do you want to overwrite it?"
          );
          if (res) {
            const delRes = await deleteDb();
            if (delRes) {
              createDatabase(jsoned);
            }
          }
        }
        setIsLoading(false);
      });
  };

  return (
    <Fragment>
      <div className="flex gap-10 items-center mt-5">
        <h3 className="text-lg font-semibold">Add New Database</h3>
      </div>
      <DBFields name={name} setName={setName} type={type} setType={setType}>
        <ImportFromScript
          handleCreateDB={handleCreateDB}
          name={name}
          isLoading={isLoading}
          script={script}
          setScript={setScript}
          handleImportFromScript={handleImportFromScript}
        />
      </DBFields>
    </Fragment>
  );
};







type ImportProp = {
  handleCreateDB?: (e: React.MouseEvent<HTMLElement>) => void;
  name: string;
  isLoading: boolean;
  script: string;
  setScript: React.Dispatch<React.SetStateAction<string>>;
  handleImportFromScript: (e: React.MouseEvent<HTMLElement>) => void;
};


const ImportFromScript: FC<ImportProp> = ({
  handleCreateDB,
  name,
  isLoading,
  script,
  setScript,
  handleImportFromScript,
}) => {
  const [isScript, setIsScript] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleShowScript = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsScript(true);
  };

  const handleCancelScript = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsScript(false);
  };

  const handleCancelCreate = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(setIsNew(false));
  };

  return (
    <>
      <div>
        <button
          className="border border-black btn btn-success mx-2 my-5 w-56"
          onClick={handleShowScript}
        >
          Import from Script
        </button>
      </div>
      <div>
        {isScript ? (
          <>
            <div className="w-auto">
              <label className="input-group input-group-vertical ">
                <span className="label-text h-14">Paste your SQL here</span>
                <textarea
                  required
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="h-96 input input-bordered"
                />
              </label>
            </div>
            <div className="flex items-center mt-2">
              <button className="btn btn-error" onClick={handleCancelScript}>
                Cancel
              </button>
              <button
                className={`btn btn-success mx-2 w-56 ${
                  isLoading && "loading"
                }`}
                onClick={handleImportFromScript}
                disabled={name.length === 0 || script.length === 0}
              >
                Import
              </button>
            </div>
          </>
        ) : (
          <div className="flex mt-6">
            <button
              className={`btn btn-success btn-circle ${isLoading && "loading"}`}
              onClick={handleCreateDB}
              disabled={name.length === 0}
            >
              {!isLoading && <span className="material-icons">add</span>}
            </button>
            <button
              className="btn ml-1 btn-circle btn-error"
              onClick={handleCancelCreate}
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DbForm;
