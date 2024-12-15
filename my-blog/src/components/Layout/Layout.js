import React from "react";
import { Outlet } from "react-router-dom";
import NavbarWrapper from "../Navbars/NavbarWrapper";

const Layout = () => {
  return (
    <>
      <NavbarWrapper />
      <div id="page-body">
        <Outlet /> {/* This will render the current route's content */}
      </div>
    </>
  );
};

export default Layout;