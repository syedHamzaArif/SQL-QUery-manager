import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDimension } from "../../hooks/useDimension";
import sqlquerylogo from "../../public/ai-query.png";
type Props = {
  handelScrollToContact?: () => void;
  handelScrollToFeatures?: () => void;
  handelScrollToPricing?: () => void;
};

const Navbar = ({
  handelScrollToContact = () => { },
  handelScrollToFeatures = () => { },
  handelScrollToPricing = () => { },
}: Props) => {
  const router = useRouter();
  const { user } = useUser();

  const handleRouteToHome = (anchor: string) => {
    router.push(`/?anchor=${anchor}`);
  };

  const [width] = useDimension();

  return (
    <div className="navbar bg-base-100  m-auto md:px-16 ">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost md:hidden">
            <span className="material-icons">menu</span>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {router.pathname !== "/dashboard" && (
              <>
                <li
                  onClick={() =>
                    router.pathname === ""
                      ? handelScrollToFeatures()
                      : handleRouteToHome("features")
                  }
                >
                  <a>Features</a>
                </li>
                <li
                  onClick={() =>
                    router.pathname === ""
                      ? handelScrollToContact()
                      : handleRouteToHome("contact")
                  }
                >
                  <a>Contact</a>
                </li>
                <li>
                  <Link href="/sql-to-english-translator">
                    <a>SQL to English</a>
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li>
                {width > 1024 ? (
                  <Link href="/dashboard">
                    <a
                      className={
                        router.pathname === "/dashboard" ? "text-primary" : ""
                      }
                    >
                      Dashboard
                    </a>
                  </Link>
                ) : (

                  ""
                )}
              </li>
            )}
          </ul>
        </div>
        <Link href={"/"}>
          <a className="btn btn-ghost normal-case text-lg md:text-xl md:font-extrabold flex items-center gap-4">
            {/* <img
              className="rounded-xl hidden sm:w-12 sm:block"
              src={"/ai-query.png"}
              alt={"SQL Query Logo"}
            />{" "} */}
            <Image
              className="rounded-xl hidden sm:w-12 sm:block"
              src={sqlquerylogo}
              alt="SQL Query Manage"
              width="40px"
              height="40px"
            />{" "}
            SQL Query
          </a>
        </Link>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal p-0">
          {router.pathname !== "/dashboard" && (
            <>
              <li
                onClick={() =>
                  router.pathname === ""
                    ? handelScrollToFeatures()
                    : handleRouteToHome("features")
                }
              >
                <a>Features</a>
              </li>
              <li
                onClick={() =>
                  router.pathname === ""
                    ? handelScrollToContact()
                    : handleRouteToHome("contact")
                }
              >
                <a>Contact</a>
              </li>
              <li>
                <Link href="/sql-to-english-translator">
                  <a>SQL to English</a>
                </Link>
              </li>
            </>
          )}

          {user && (
            <li>
              {width > 1024 ? (
                <Link href="/dashboard">
                  <a
                    className={
                      router.pathname === "/dashboard" ? "text-primary" : ""
                    }
                  >
                    Dashboard
                  </a>
                </Link>
              ) : (
                ""
              )}
            </li>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <a
            className="btn btn-primary btn-sm sm:btn-md"
            href={"/api/auth/logout"}
          >
            Logout
          </a>
        ) : (
          <>
            <a
              className="btn btn-primary btn-sm sm:btn-md"
              href={"/api/auth/login?screen_hint=signup"}
            >
              Sign Up
            </a>
            <a
              className="btn btn-ghost btn-sm sm:btn-md sm:ml-4"
              href={"/api/auth/login"}
            >
              Login
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
