"use client";
import { getDateFromISO8601, truncateString } from '@/utils/utility';
import { Card, Badge, Button, Chip } from '@nextui-org/react';
import { BiComment, BiCommentAdd, BiCommentCheck, BiCommentDetail, BiCommentDots, BiCommentEdit, BiCommentError, BiCommentMinus, BiEdit, BiTrash } from 'react-icons/bi';
import { CgAttachment } from 'react-icons/cg';
import { GrAttachment } from 'react-icons/gr';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { TaskForm } from './TaskForm';
import { useState } from 'react';
import toast from 'react-hot-toast';
import fetchApi from '@/utils/fetchApi';
import { LuEye } from "react-icons/lu";
import ViewTodo from './ViewTodo';
import { useSelector } from 'react-redux';

interface TaskCardProps {
    taskData: any;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    taskData
}) => {
    const { isLoggedIn, userData } = useSelector((state: any) => state.Auth)
    console.log("userData", userData);
    const {
        title,
        description,
        dueDate,
        priority,
        assignee,
        creator,
        status,
        createdBy,
        assignedTo
    } = taskData;
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)
    const [viewDrawerIsOpen, setViewDrawerIsOpen] = useState(false)
    const statusColors: any = {
        pending: 'text-yellow-500',
        'in-progress': 'text-blue-500',
        completed: 'text-green-500',
    };

    const colorStatusVariants: any = {
        pending: 'warning',
        'in-progress': 'primary',
        completed: 'success',
    };

    const colorPriorityVariants: any = {
        low: 'success',
        medium: 'warning',
        high: 'danger',
    };

    const handleDelete = async () => {
        try {
            const response = await fetchApi({
                endpoint: `/api/todos/${taskData.id}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.statusCode === 200) {
                // toast.success(response.message);
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
    };


    return (<>
        <Card className="p-4 mb-4 shadow-lg w-[400px] min-h-[200px]">
            <div className="flex justify-between items-center font-bold">
                <h3 className='break-words text-wrap break-all'>{truncateString(title, 35)}</h3>
                <Chip color={colorPriorityVariants[priority]} className='capitalize'>
                    {priority}
                </Chip>
            </div>
            <div className='mt-2 break-words text-wrap'>{truncateString(description, 100)}</div>
            <div className="mt-4">
                <div className='flex justify-between flex-wrap'>
                    <small className="text-gray-500 mr-1">Due: {getDateFromISO8601({ isoDate: dueDate })}</small>
                    <small className={`${statusColors[status]} font-semibold`}>Status: <span className='capitalize'>{status}</span></small>
                </div>
                <div className='mt-2'>
                    <div className="text-gray-500 text-sm">Created by: {creator?.name} ({creator?.userRole})</div>
                    <div className="text-gray-500 text-sm">Assigned to: {assignee?.name} ({assignee?.userRole})</div>
                </div>
            </div>
            <div className="flex justify-between mt-4">
                <div className="space-x-3 flex">
                    <abbr title="Add Comments">
                        <BiCommentDetail className='my-auto text-blue-500 cursor-pointer' size={22} />
                    </abbr>
                    <abbr title='Upload Attachments'>
                        <GrAttachment className='my-auto text-blue-500 cursor-pointer' size={21} />
                    </abbr>
                </div>
                <div className="space-x-2 flex">
                    <abbr title="View Task"><LuEye className='my-auto text-blue-500 cursor-pointer' size={23} onClick={() => {
                        setViewDrawerIsOpen(true)
                    }} /></abbr>
                    <abbr title="Edit Task"><BiEdit className='my-auto text-blue-500 cursor-pointer' size={22}
                        onClick={() => {
                            if (userData.userRole === 'regular-user') {
                                if (((String(userData.id) === String(createdBy)) || (String(userData.id) === String(assignedTo))) && userData.userRole === 'regular-user') {
                                    setDrawerIsOpen(true)
                                } else {
                                    toast.error('You are not authorized to edit this task')
                                }
                            } else {
                                setDrawerIsOpen(true)
                            }
                        }}
                    /></abbr>
                    <abbr title="Delete Task">
                        <BiTrash className='my-auto text-red-500 cursor-pointer' size={22}
                            onClick={() => {
                                if (userData.userRole === 'regular-user') {
                                    if (((String(userData.id) === String(createdBy)) || (String(userData.id) === String(assignedTo))) && userData.userRole === 'regular-user') {
                                        handleDelete()
                                    } else {
                                        toast.error('You are not authorized to delete this task')
                                    }
                                } else {
                                    handleDelete()
                                }
                            }}
                        />
                    </abbr>
                </div>
            </div>
        </Card>

        {drawerIsOpen === true && (
            <TaskForm
                isOpen={drawerIsOpen}
                toggleDrawer={() => setDrawerIsOpen(!drawerIsOpen)}
                taskData={taskData}
            />
        )}

        {viewDrawerIsOpen === true && (
            <ViewTodo
                isOpen={viewDrawerIsOpen}
                toggleDrawer={() => setViewDrawerIsOpen(!viewDrawerIsOpen)}
                todoData={taskData}
            />
        )}
    </>);
};
