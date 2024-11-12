"use client";
import fetchApi from '@/utils/fetchApi';
import { debounce, getDateFromISO8601 } from '@/utils/utility';
import { Card, CardBody } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { IoMdArrowBack } from 'react-icons/io';
import Drawer from 'react-modern-drawer';

const View = ({ isOpen, toggleDrawer, userData }: any) => {
    const [isResponsive, setIsResponsive] = useState(false);
    const [teamMembers, setTeamMembers] = useState([])
    const [teamData, setTeamData] = useState([])
    const handleGetUserDetail = async () => {
        try {
            const response = await fetchApi({
                endpoint: `/api/users/${userData.id}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })

            if (response.statusCode === 200) {
                if (response?.data) {
                    const data = response?.data
                    if (userData.userRole === "teamlead") {
                        const teamLeadFor = data?.teamLeadFor
                        if (teamLeadFor && teamLeadFor.length > 0) {
                            const members = teamLeadFor[0]?.members
                            if (members && members.length > 0) {
                                setTeamMembers(members);
                            }
                        }
                    } else if (userData.userRole === "regular-user") {
                        const teams = data?.teams
                        if (teams && teams.length > 0) {
                            setTeamData(teams);
                        }
                    }
                }
            } else {
                toast.error(response.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    }

    const debounceGetUserDetail = useCallback(debounce(handleGetUserDetail, 500), [])

    useEffect(() => {
        if (userData && userData.id) {
            debounceGetUserDetail()
        }
    }, [userData])


    useEffect(() => {
        // Define the media query
        const mediaQuery = window.matchMedia('(max-width: 768px)');

        // Event handler when screen size changes
        const handleResize = () => {
            setIsResponsive(mediaQuery.matches);
        };

        // Attach listener to media query
        mediaQuery.addEventListener('change', handleResize);

        // Call the handler right away so state gets updated with the initial value
        handleResize();

        // Cleanup the event listener on component unmount
        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    return (
        <Drawer
            open={isOpen}
            onClose={toggleDrawer}
            direction='right'
            className='overflow-auto'
            size={isResponsive ? "100vw" : "60vw"}
        >
            <div className='m-6'>
                <div className="text-2xl font-bold mb-4 flex justify-start select-none text-primary-500">
                    <IoMdArrowBack className='my-auto mr-1 cursor-pointer text-primary-500' onClick={() => toggleDrawer()} />
                    View User
                </div>

                <div>
                    <div className={`grid gap-4 ${isResponsive ? "grid-cols-1" : "grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"}`}>


                        <div className="w-full px-4 py-2">
                            <b>Name :</b> {userData?.name}
                        </div>

                        <div className="w-full px-4 py-2">
                            <b>Email :</b> {userData?.email}
                        </div>

                        <div className="w-full px-4 py-2">
                            <b>Role :</b> {userData?.userRole}
                        </div>

                        <div className="w-full px-4 py-2">
                            <b>Created At :</b> {getDateFromISO8601({ isoDate: userData?.createdAt })}
                        </div>

                        <div className="w-full px-4 py-2">
                            <b>Updated At :</b> {getDateFromISO8601({ isoDate: userData?.updatedAt })}
                        </div>
                    </div>

                    {userData.userRole === "teamlead" && teamMembers.length > 0 && (
                        <div className="container mx-auto mt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Team Members</h2>
                            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Updated At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {teamMembers.map((item: any) => (

                                            <tr className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{getDateFromISO8601({ isoDate: item.createdAt })}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{getDateFromISO8601({ isoDate: item.updatedAt })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {userData.userRole === "regular-user" && teamData.length > 0 && (<>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Teams</h2>
                        {teamData.map((item: any) => (<>

                            <Card className='my-5'>
                                <CardBody>

                                    <div className="container mx-auto mt-6">
                                        <div className="text-xl font-semibold text-gray-800 mb-3">
                                            Team Lead Information
                                        </div>
                                        <div>
                                            Name : {item.teamLead.name}
                                        </div>
                                        <div>
                                            Email : {item.teamLead.email}
                                        </div>
                                        <div className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                                            Team Members
                                        </div>
                                        {item.members && item.members.length > 0 && (
                                            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                                                <table className="min-w-full bg-white border border-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Name
                                                            </th>
                                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Email
                                                            </th>
                                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Created At
                                                            </th>
                                                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                Updated At
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-100">
                                                        {item.members.map((item: any) => (

                                                            <tr className="hover:bg-gray-50 transition duration-150">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.email}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{getDateFromISO8601({ isoDate: item.createdAt })}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{getDateFromISO8601({ isoDate: item.updatedAt })}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>

                                </CardBody>
                            </Card>
                        </>))}
                    </>)}
                </div>
            </div>
        </Drawer>
    )
}

export default View