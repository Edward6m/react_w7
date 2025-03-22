import { Outlet } from "react-router-dom";

import Header from "./pages/Header";
import Footer from "./pages/Footer";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
