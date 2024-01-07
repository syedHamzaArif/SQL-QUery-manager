import type { AppProps } from "next/app";
// import { Layout } from "@components/Layout";
import { UserProvider } from "@auth0/nextjs-auth0";
import HOC from "@components/HOC";
import { getAnalytics } from "firebase/analytics";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { app } from "../firebase/firebase";
import store, { RootState, persistor } from "../redux/store";
import "../styles/globals.css";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useDimension } from "../hooks/useDimension";
import { useDispatch } from "react-redux";
import { setDarkModeTheme } from "../redux/reducers/darkModeSlice";
import { useSelector } from "react-redux";
import ThemeProvider from "@components/ThemeProvider/DarkModeProvider";
import DarkModeProvider from "@components/ThemeProvider/DarkModeProvider";
import MobileViewScreen from "@components/MobileViewScreen";
import { PersistGate } from "redux-persist/integration/react";

const CrispWithNoSSR = dynamic(() => import("../components/Crisp"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [width, height] = useDimension();

  return (
    <UserProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DarkModeProvider>
            {router.pathname.includes("dashboard") ? (
              <>
                {height < 600 || width !== 0 && width <= 1025 ? (
                  <MobileViewScreen />
                ) : (
                  <HOC>
                    <Component {...pageProps} />
                  </HOC>
                )}
              </>
            ) : (
              <Component {...pageProps} />
            )}
          </DarkModeProvider>
        </PersistGate>
      </Provider>
    </UserProvider>
  );
}

export default MyApp;
