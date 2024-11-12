"use client"
import React, { useEffect, useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { handleNavigation } from '@/utils/utility';
import logo from "@/assets/image/logo.png"
import { useDispatch, useSelector } from 'react-redux';
import { AuthStateType } from '@/redux/actions-reducers/auth/initializeAuthState';
import path from 'path';
import Button from '../Button';
import toast from 'react-hot-toast';
import { handleResetAuthState } from '@/redux/actions-reducers/auth/auth';
import fetchApi from '@/utils/fetchApi';

const NavbarComponent = () => {

    const { isLoggedIn, userData } = useSelector((state: any) => state.Auth)
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const [navbarOptions, setNavbarOptions] = useState<any>([])
    useEffect(() => {
        setNavbarOptions([
            {
                id: 1,
                name: "Users",
                path: "/users",
                isActive: isLoggedIn === true && userData?.userRole === "admin" ? true : false
            },
            {
                id: 6,
                name: "Todos",
                path: "/",
                isActive: isLoggedIn === true ? true : false
            },
            {
                id: 2,
                name: "Login",
                path: "/login",
                isActive: isLoggedIn === true ? false : true
            },
            {
                id: 3,
                name: "Sign Up",
                path: "/signup",
                isActive: isLoggedIn === true ? false : true
            },
            {
                id: 5,
                name: `${userData?.name} (${userData?.userRole})`,
                isActive: isLoggedIn === true ? true : false
            },
            {
                id: 4,
                name: "Logout",
                isActive: isLoggedIn === true ? true : false
            },
        ])
    }, [isLoggedIn])

    const handleItemClick = async (item: { name: string }) => {
        try {

            if (item.name === "Logout") {
                localStorage.clear()
                dispatch(handleResetAuthState())
                handleNavigation({ path: '/login', router })
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: "copy" });
            } else {
                toast.error('An unknown error occurred', { id: "copy" });
            }
        }
    }
    return (<>
        <Navbar isBordered={true}>
            <NavbarContent justify="start">
                <NavbarBrand >
                    <p className="font-bold text-inherit text-md sm:text-xl cursor-pointer " onClick={e => handleNavigation({ path: "/", router })}>
                        Todo
                    </p>
                </NavbarBrand>

            </NavbarContent>
            <NavbarContent justify="end" className="hidden sm:flex">

                {navbarOptions.map((item: any) => {
                    if (item.isActive) {
                        return <NavbarItem key={item.id} isActive={true}>
                            {
                                item.path ?
                                    item.path === pathname ?
                                        <Button color="primary" variant="flat" size="sm" label={item.name} />
                                        :
                                        <Link
                                            href={item.path}
                                            className='text-sm'
                                            onClick={e => {
                                                e.preventDefault()
                                                handleNavigation({ path: item.path, router })
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    :

                                    <p className={` ${item.id !== 5 ? 'cursor-pointer' : "cursor-default"}`} onClick={() => handleItemClick(item)}>{item.name}</p>
                            }
                        </NavbarItem>
                    }
                })}
            </NavbarContent>

            <NavbarContent className="sm:hidden" justify="end">
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarMenu>
                {navbarOptions.filter((item: any) => item.isActive).map((item: any, index: number) => (
                    <NavbarMenuItem key={`${item.name}-${index}`}>
                        <Button color="primary" variant="light" size="sm" label={item.name} onClick={() => handleItemClick(item)} />
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    </>)
}

export default NavbarComponent
