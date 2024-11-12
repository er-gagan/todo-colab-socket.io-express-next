"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { debounce, handleNavigation, hideLoader, showLoader } from "@/utils/utility";
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import NavbarComponent from "@/components/Navbar";
import { NextUIProvider } from "@nextui-org/system";
import { handleCheckUserIsLoggedin, handleGetUserDataRequest } from "@/redux/actions-reducers/auth/auth";
import 'react-modern-drawer/dist/index.css'
// import { private_routes, public_routes } from "@/route";

const LayoutWrapper = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { isLoggedIn } = useSelector((state: any) => state.Auth)
    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter()
    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        if (window !== undefined) {
            const token = localStorage.getItem('token')
            if (token) {
                dispatch(handleGetUserDataRequest())
            }
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (pathname === location.pathname) {
                const { origin } = location;
                setBaseUrl(origin)
                // if (isLoggedIn === true) {
                //     if (private_routes.filter(route => route !== location.pathname).length > 0) {
                //         handleNavigation({ path: "/", router })
                //     }
                // } else {
                //     if (public_routes.filter(route => route !== location.pathname).length > 0) {
                //         handleNavigation({ path: "/login", router })
                //     }
                // }
                hideLoader()
            } else {
                showLoader()
            }
        }
    }, [pathname, isLoggedIn])


    return (
        <>
            <NextUIProvider>
                <div className="w-screen h-screen overflow-auto">
                    <NavbarComponent />
                    {children}
                </div>
            </NextUIProvider>

            <div id="globalLoader" className="fixed z-[9999] top-1/2 left-1/2 bg-white w-full h-full flex justify-center items-center" >
                <div className="flex justify-center items-center h-screen" >
                    <img src={`${baseUrl}/loading.gif`} alt="loading image" />
                </div>
            </div>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </>
    );
};

export default LayoutWrapper;
