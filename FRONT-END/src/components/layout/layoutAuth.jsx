import React from "react";
import HeaderAuth from "../header/headerAuth";
import Footer from "../footer/footer";
import { Outlet } from "react-router-dom";

const LayoutAuth = () => {
  return (
    <>
      <HeaderAuth />
      <section>
        <Outlet />
      </section>
      <Footer />
    </>
  );
};
export default LayoutAuth;
