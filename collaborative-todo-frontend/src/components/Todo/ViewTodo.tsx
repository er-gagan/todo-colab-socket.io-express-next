"use client";
import React, { useEffect, useState } from 'react'
import Drawer from 'react-modern-drawer';
import View from '../User/View';
import { IoMdArrowBack } from 'react-icons/io';
import { getDateFromISO8601 } from '@/utils/utility';

const ViewTodo = ({ isOpen, toggleDrawer, todoData }: any) => {
    const [isResponsive, setIsResponsive] = useState(false);

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
            size={isResponsive ? "100vw" : "50%"}
        >
            <div className='m-6'>
                <div className="text-2xl font-bold mb-4 flex justify-start select-none text-primary-500">
                    <IoMdArrowBack className='my-auto mr-1 cursor-pointer text-primary-500' onClick={() => toggleDrawer()} />
                    View Task
                </div>
                <div className="space-y-4">
                    <div>
                        <b>Title:</b> {todoData.title}
                    </div>
                    <div>
                        <b>Description:</b> {todoData.description}
                    </div>
                    <div>
                        <b>Due Date:</b> {getDateFromISO8601({ isoDate: todoData.dueDate })}
                    </div>
                    <div>
                        <b>Priority:</b> {todoData.priority}
                    </div>
                    <div>
                        <b>Assignee:</b> {todoData.assignee.name}
                    </div>
                    <div>
                        <b>Creator:</b> {todoData.creator.name}
                    </div>
                    <div>
                        <b>Status:</b> {todoData.status}
                    </div>
                    <div>
                        <b>Created At:</b> {getDateFromISO8601({ isoDate: todoData.createdAt })}
                    </div>
                    <div>
                        <b>Updated At:</b> {getDateFromISO8601({ isoDate: todoData.updatedAt })}
                    </div>
                </div>
            </div>
        </Drawer>

    )
}

export default ViewTodo