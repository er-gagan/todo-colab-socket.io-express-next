"use client";
import { Input, Button, Select, Textarea, DatePicker, SelectItem } from '@nextui-org/react';
import Drawer from 'react-modern-drawer'
import { IoMdArrowBack } from "react-icons/io";
import React, { useCallback, useEffect, useState } from 'react';
import fetchApi from '@/utils/fetchApi';
import toast from 'react-hot-toast';
import { parseDate } from "@internationalized/date";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetAllRegularAndTeamLeadUsersRequest, handleGetAllRegularUsersUnderTeamLeaderRequest, handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserRequest, handleGetAllTeamLeadersUnderRegularUserRequest, handleGetAllUsersRequest } from '@/redux/actions-reducers/user/user';
import { debounce } from '@/utils/utility';

export const TaskForm = ({ isOpen, toggleDrawer, taskData }: any) => {
    const dispatch = useDispatch()
    const { isLoggedIn, userData } = useSelector((state: any) => state.Auth)
    const [isEditForm, setIsEditForm] = useState(taskData && taskData.id ? true : false)
    const {
        getAllUsers,
        getAllUsersLoading,
        getAllTeamLeadersAndRegularMemberUsersUnderRegularUser,
        getAllTeamLeadersAndRegularMemberUsersUnderRegularUserLoading,
        getAllRegularUsersUnderTeamLeader,
        getAllRegularUsersUnderTeamLeaderLoading
    } = useSelector((state: any) => state.User)
    const [isResponsive, setIsResponsive] = useState(false);
    const [taskState, setTaskState] = useState<any>({
        title: '',
        description: '',
        dueDate: null,
        priority: '',
        assignedTo: '',
        status: 'pending'
    });

    const handleApiCall1 = () => {
        dispatch(handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserRequest())
    }
    const handleApiCall2 = () => {
        dispatch(handleGetAllUsersRequest({}))
    }

    const handleApiCall3 = () => {
        dispatch(handleGetAllRegularUsersUnderTeamLeaderRequest())
    }

    const debounceHandleApiCall1 = useCallback(debounce(handleApiCall1, 500), [])
    const debounceHandleApiCall2 = useCallback(debounce(handleApiCall2, 500), [])
    const debounceHandleApiCall3 = useCallback(debounce(handleApiCall3, 500), [])


    useEffect(() => {
        if (userData) {
            if (userData.userRole === "regular-user") {
                debounceHandleApiCall1()
            } else if (userData.userRole === "admin") {
                debounceHandleApiCall2()
            } else if (userData.userRole === "teamlead") {
                debounceHandleApiCall3()
            }
        }
    }, [userData])

    useEffect(() => {
        if (taskData) {
            setTaskState({
                title: taskData.title,
                description: taskData.description,
                dueDate: parseDate(moment(taskData.dueDate).format("YYYY-MM-DD")),
                priority: taskData.priority,
                assignedTo: taskData.assignedTo,
                status: taskData.status
            });
        }
    }, [taskData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetchApi({
                endpoint: isEditForm ? `/api/todos/${taskData.id}` : '/api/todos',
                method: isEditForm ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                payload: { ...taskState, dueDate: new Date(taskState.dueDate).toISOString() }
            });
            if (response.statusCode === 201 || response.statusCode === 200) {
                toggleDrawer();
            } else {
                toast.error(response.message, { id: "copy" });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: "copy" });
            } else {
                toast.error('An unknown error occurred', { id: "copy" });
            }
        }
    };

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
            size={isResponsive ? "100vw" : "350px"}
        >
            <div className='m-6'>
                <div className="text-2xl font-bold mb-4 flex justify-start select-none text-primary-500">
                    <IoMdArrowBack className='my-auto mr-1 cursor-pointer text-primary-500' onClick={() => toggleDrawer()} />
                    {isEditForm ? 'Update Task' : 'Create Task'}
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        label="Title"
                        fullWidth={true}
                        placeholder="Enter task title" required={true}
                        isRequired={true}
                        onChange={(e) => setTaskState({ ...taskState, title: e.target.value })}
                        value={taskState.title}
                    />
                    <Textarea
                        label="Description"
                        fullWidth={true}
                        placeholder="Enter task description"
                        required={true}
                        isRequired={true}
                        onChange={(e) => setTaskState({ ...taskState, description: e.target.value })}
                        value={taskState.description}
                    />
                    <DatePicker
                        label="Due Date"
                        fullWidth={true}
                        onChange={(e) => setTaskState({ ...taskState, dueDate: e })}
                        value={taskState.dueDate}
                        isRequired={true}

                    />
                    <Select
                        label="Priority"
                        fullWidth={true}
                        placeholder="Select priority"
                        required={true}
                        isRequired={true}
                        onChange={(e) => setTaskState({ ...taskState, priority: e.target.value })}
                        value={taskState.priority}
                        selectedKeys={[taskState.priority]}
                    >
                        <SelectItem key="low" value="low">Low</SelectItem>
                        <SelectItem key="medium" value="medium">Medium</SelectItem>
                        <SelectItem key="high" value="high">High</SelectItem>
                    </Select>
                    {userData.userRole === "regular-user" ? (<>
                        <Select
                            label="Assigned To"
                            isRequired={true}
                            required={true}
                            fullWidth={true}
                            description="You can only assign tasks to your team leaders and regular users (colleagues) who report to you."
                            onChange={(e) => setTaskState({ ...taskState, assignedTo: e.target.value })}
                            isLoading={getAllTeamLeadersAndRegularMemberUsersUnderRegularUserLoading}
                            value={taskState.assignedTo}
                            selectedKeys={[String(taskState.assignedTo)]}
                            placeholder="Select user"
                        >
                            {getAllTeamLeadersAndRegularMemberUsersUnderRegularUser.map((user: any) => <SelectItem key={user.id} value={String(user.id)}>{`${user.name} (${user.userRole})`}</SelectItem>)}
                        </Select>

                    </>
                    ) : userData.userRole === "teamlead" ? (
                        <Select
                            label="Assigned To"
                            isRequired={true}
                            required={true}
                            fullWidth={true}
                            onChange={(e) => setTaskState({ ...taskState, assignedTo: e.target.value })}
                            isLoading={getAllRegularUsersUnderTeamLeaderLoading}
                            value={taskState.assignedTo}
                            description="You can only assign tasks to your regular users (colleagues) who report to you."
                            selectedKeys={[String(taskState.assignedTo)]}
                            placeholder="Select user"
                        >
                            {getAllRegularUsersUnderTeamLeader.map((user: any) => <SelectItem key={user.id} value={String(user.id)}>{`${user.name}`}</SelectItem>)}
                        </Select>
                    ) : userData.userRole === "admin" && (
                        <Select
                            label="Assigned To"
                            isRequired={true}
                            required={true}
                            fullWidth={true}
                            onChange={(e) => setTaskState({ ...taskState, assignedTo: e.target.value })}
                            description="You can assign tasks to team leaders and regular users."
                            isLoading={getAllUsersLoading}
                            value={taskState.assignedTo}
                            selectedKeys={[String(taskState.assignedTo)]}
                            placeholder="Select user"
                        >
                            {getAllUsers.map((user: any) => <SelectItem key={user.id} value={String(user.id)}>{`${user.name} (${user.userRole})`}</SelectItem>)}
                        </Select>
                    )}
                    <Select
                        label="Status"
                        fullWidth={true}
                        isRequired={true}
                        required={true}
                        onChange={(e) => setTaskState({ ...taskState, status: e.target.value })}
                        value={taskState.status}
                        placeholder="Select status"
                        selectedKeys={[taskState.status]}
                    >
                        <SelectItem
                            key="pending"
                            value="pending"
                        >Pending</SelectItem>
                        <SelectItem key="in-progress" value="in-progress">In Progress</SelectItem>
                        <SelectItem key="completed" value="completed">Completed</SelectItem>
                    </Select>
                    <Button type="submit" className="w-full" color="primary">
                        {isEditForm ? 'Update Task' : 'Create Task'}
                    </Button>
                </form>
            </div>
        </Drawer>
    );
};
