import { Navbar } from "../Navbar";

type Props = {
  children: any;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-2xl m-auto bg-base-200">{children}</main>
    </>
  );
};

export default Layout;
