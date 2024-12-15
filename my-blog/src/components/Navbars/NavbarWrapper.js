import React from "react";
import { useLocation } from "react-router-dom";
import BasicNavbar from "./BasicNavbar";
import BlogNavbar from "./BlogNavbar";



const NavbarWrapper = () => {
    const location = useLocation();
    const { pathname } = location;

    // Define rules for basic and blog-specific navbars
    const isBlogPage = pathname.startsWith("/blogs");
    const isBasicPage = !isBlogPage; // All non-blog pages use the BasicNavbar

    return (
        <>
            {isBasicPage && <BasicNavbar />}
            {isBlogPage && <BlogNavbar />}
        </>
    );
};

export default NavbarWrapper;