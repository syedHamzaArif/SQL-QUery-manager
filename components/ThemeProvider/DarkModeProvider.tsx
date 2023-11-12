import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setDarkModeTheme } from "../../redux/reducers/darkModeSlice";
import { RootState } from "../../redux/store";

const DarkModeProvider = ({ children }: any) => {
  const dispatch = useDispatch();
  const newTheme = useSelector(
    (state: RootState) => state.persistedReducer.darkmode.theme
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-colors-scheme:dark)").matches) {
      dispatch(setDarkModeTheme("dark"));
    } else {
      dispatch(setDarkModeTheme("light"));
    }
   
  }, []);

  useEffect(() => {
    if(document){
      // @ts-ignore
      document.querySelector('html').setAttribute('data-theme', newTheme)!;
    }
  }, [newTheme])
  


  // React.useEffect(() => {
   
  // }, [theme]);


  useEffect(() => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [newTheme]);

  return children;
};

export default DarkModeProvider;
