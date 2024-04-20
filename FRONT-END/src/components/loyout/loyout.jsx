import React from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import { Outlet } from "react-router-dom";

const Loyout = () => {
    return (
        <>
            <Header />
            <section>
                <Outlet />
            </section>
            <Footer />
        </>
    )
}
export default Loyout;