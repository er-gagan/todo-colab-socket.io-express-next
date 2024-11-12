"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AttachmentUploader } from "@/components/Todo/AttachmentUploader";
import { TaskCard } from "@/components/Todo/TaskCard";
import { TaskComments } from "@/components/Todo/TaskComments";
import { TaskForm } from "@/components/Todo/TaskForm";
import { Card, CardBody, DatePicker, Select, SelectItem } from "@nextui-org/react";
import socket from "@/services/socket";
import toast from "react-hot-toast";
import fetchApi from "@/utils/fetchApi";
import SearchIcon from "@/assets/icon/SearchIcon";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import { GrPowerReset } from "react-icons/gr";
import qs from 'qs';
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { handleGetAllRegularUsersUnderTeamLeaderRequest, handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserRequest, handleGetAllUsersRequest } from "@/redux/actions-reducers/user/user";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "@/utils/utility";

const ToDoPage = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userData } = useSelector((state: any) => state.Auth)
  const {
    getAllUsers,
    getAllUsersLoading,
    getAllTeamLeadersAndRegularMemberUsersUnderRegularUser,
    getAllTeamLeadersAndRegularMemberUsersUnderRegularUserLoading,
    getAllRegularUsersUnderTeamLeader,
    getAllRegularUsersUnderTeamLeaderLoading
  } = useSelector((state: any) => state.User)
  const [search, setSearch] = useState("")
  const [priority, setPriority] = useState("")
  const [status, setStatus] = useState("")
  const [dueDate, setDueDate] = useState<any>(null)
  const [createdBy, setCreatedBy] = useState("")
  const [assignedTo, setAssignedTo] = useState("")

  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)
  const [todoList, setTodoList] = useState<any>([])
  const [flag, setFlag] = useState(false)
  const handleReset = () => {
    setSearch("")
    setPriority("")
    setStatus("")
    setDueDate(null)
    setCreatedBy("")
    setAssignedTo("")
    setSortBy("")
    setSortOrder("")
    setFlag(!flag)
  }

  const fetchAllTodos = async (props: { search?: string, priority?: string, status?: string, dueDate?: string, createdBy?: string, assignedTo?: string, sortBy?: string, sortOrder?: string }) => {
    try {

      const {
        search, priority, status, dueDate, createdBy, assignedTo, sortBy, sortOrder
      } = props

      const payload = {
        search: search ? search : undefined,
        priority: priority ? priority : undefined,
        status: status ? status : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        createdBy: createdBy ? createdBy : undefined,
        assignedTo: assignedTo ? assignedTo : undefined,
        sortBy: sortBy ? sortBy : undefined,
        sortOrder: sortOrder ? sortOrder : undefined
      }
      const params = qs.stringify(payload)

      const response = await fetchApi({
        endpoint: `/api/todos?${params}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.statusCode === 200) {
        setTodoList(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  const debounceFetchAllTodos = useCallback(debounce(fetchAllTodos, 500), [])

  useEffect(() => {
    debounceFetchAllTodos({
      search, priority, status, dueDate, createdBy, assignedTo, sortBy, sortOrder
    });
  }, [flag, search, priority, status, dueDate, createdBy, assignedTo, sortBy, sortOrder]);

  useEffect(() => {

    socket.on('newTodo', (item: any) => {
      setFlag(!flag);
      toast.success(`New item added: ${item.title}`, { id: "copy" });
    });
    socket.on('updateTodo', (updatedItem: any) => {
      setFlag(!flag);
      toast.success(`Item updated: ${updatedItem.title}`, { id: "copy" });
    });
    socket.on('deleteTodo', (id: any) => {
      setFlag(!flag);
      toast.success(`Item deleted`);
    });

    return () => {
      socket.off('newTodo');
      socket.off('updateTodo');
      socket.off('deleteTodo');
    };
  }, []);

  // const handleApiCall = () => {
  //   dispatch(handleGetAllUsersRequest({}));
  // }

  // const debounceHandleApiCall = useCallback(debounce(handleApiCall, 500), [])

  // useEffect(() => {
  //   debounceHandleApiCall();
  // }, [])

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
    if (isLoggedIn === true) {

      if (userData) {
        if (userData.userRole === "regular-user") {
          debounceHandleApiCall1()
        } else if (userData.userRole === "admin") {
          debounceHandleApiCall2()
        } else if (userData.userRole === "teamlead") {
          debounceHandleApiCall3()
        }
      }
    }
  }, [userData, isLoggedIn, flag])


  return (<>
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">Enhanced To-Do List</h1>
        <Button type="button" onClick={() => setDrawerIsOpen(!drawerIsOpen)} color="primary" label="Create Todo" />
      </div>
      <div className="space-y-6">
        {/* {todoList.length > 0 ? */}
        <Card>
          <CardBody>
            <div className="text-xl font-bold mb-3 text-primary-400">
              Filtering Options
            </div>
            <div className={`grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3`}>
              <Input
                isClearable={true}
                className="w-full px-1 py-1"
                placeholder="Search..."
                label="Search"
                size="sm"
                startContent={<SearchIcon />}
                value={search}
                onValueChange={(value) => {
                  setSearch(value);
                }}
              />

              <Select
                label="Priority"
                className="w-full px-1 py-1"
                placeholder="Select priority"
                size="sm"
                onChange={(e) => setPriority(e.target.value)}
                value={priority}
                selectedKeys={[priority]}
              >
                <SelectItem key="low" value="low">Low</SelectItem>
                <SelectItem key="medium" value="medium">Medium</SelectItem>
                <SelectItem key="high" value="high">High</SelectItem>
              </Select>

              <Select
                label="Status"
                className="w-full px-1 py-1"
                size="sm"
                onChange={(e) => setStatus(e.target.value)}
                value={status}
                placeholder="Select status"
                selectedKeys={[status]}
              >
                <SelectItem
                  key="pending"
                  value="pending"
                >Pending</SelectItem>
                <SelectItem key="in-progress" value="in-progress">In Progress</SelectItem>
                <SelectItem key="completed" value="completed">Completed</SelectItem>
              </Select>

              <DatePicker
                label="Due Date"
                className="w-full px-1 py-1"
                onChange={(e) => setDueDate(e)}
                size="sm"
                value={dueDate}
              />
              {userData.userRole === "admin" ? (<>
                <Select
                  label="Created By"
                  className="w-full px-1 py-1"
                  placeholder="Select user"
                  onChange={(e) => setCreatedBy(e.target.value)}
                  value={createdBy}
                  isLoading={getAllUsersLoading}
                  size="sm"
                  selectedKeys={[createdBy]}
                >
                  {getAllUsers.map((user: any) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                    >{`${user.name} (${user.userRole})`}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Assigned To"
                  className="w-full px-1 py-1"
                  size="sm"
                  placeholder="Select user"
                  isLoading={getAllUsersLoading}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  value={assignedTo}
                  selectedKeys={[assignedTo]}
                >
                  {getAllUsers.map((user: any) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                    >{`${user.name} (${user.userRole})`}</SelectItem>
                  ))}
                </Select>
              </>) : userData.userRole === "teamlead" ? (<>
                <Select
                  label="Created By"
                  className="w-full px-1 py-1"
                  placeholder="Select user"
                  onChange={(e) => setCreatedBy(e.target.value)}
                  value={createdBy}
                  isLoading={getAllRegularUsersUnderTeamLeaderLoading}
                  size="sm"
                  selectedKeys={[createdBy]}
                >
                  {getAllRegularUsersUnderTeamLeader.map((user: any) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                    >{`${user.name}`}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Assigned To"
                  className="w-full px-1 py-1"
                  size="sm"
                  placeholder="Select user"
                  isLoading={getAllRegularUsersUnderTeamLeaderLoading}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  value={assignedTo}
                  selectedKeys={[assignedTo]}
                >
                  {getAllRegularUsersUnderTeamLeader.map((user: any) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                    >{`${user.name}`}</SelectItem>
                  ))}
                </Select>
              </>) : userData.userRole === "regular-user" && (<>
                <Select
                  label="Assigned To"
                  className="w-full px-1 py-1"
                  size="sm"
                  placeholder="Select user"
                  isLoading={getAllTeamLeadersAndRegularMemberUsersUnderRegularUserLoading}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  value={assignedTo}
                  selectedKeys={[assignedTo]}
                >
                  {getAllTeamLeadersAndRegularMemberUsersUnderRegularUser.map((user: any) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                    >{`${user.name} (${user.userRole})`}</SelectItem>
                  ))}
                </Select>
                <Select
                  label="Created By"
                  className="w-full px-1 py-1"
                  placeholder="Select user"
                  onChange={(e) => setCreatedBy(e.target.value)}
                  value={createdBy}
                  isLoading={getAllTeamLeadersAndRegularMemberUsersUnderRegularUserLoading}
                  size="sm"
                  selectedKeys={[createdBy]}
                >
                  {getAllTeamLeadersAndRegularMemberUsersUnderRegularUser.map((user: any) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                    >{`${user.name} (${user.userRole})`}</SelectItem>
                  ))}
                </Select>
              </>)}
            </div>

            <div className="text-xl font-bold my-3 text-primary-400">
              Sorting Options
            </div>
            <div className={`grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3`}>

              <Select
                label="Sort By"
                placeholder="Select sort by"
                className="w-full px-1 py-1"
                size="sm"
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
                selectedKeys={[sortBy]}
              >
                {todoList && Array.isArray(todoList) && todoList.length > 0 && Object.keys(todoList[0]).map((key: any) => (
                  <SelectItem
                    key={key}
                    value={key}
                  >{key}</SelectItem>
                ))}

              </Select>

              <Select
                label="Sort Order"
                placeholder="Select sort order"
                className="w-full px-1 py-1"
                size="sm"
                onChange={(e) => setSortOrder(e.target.value)}
                value={sortOrder}
                selectedKeys={[sortOrder]}
              >

                <SelectItem key={'asc'} value={'asc'} >
                  Ascending
                </SelectItem>
                <SelectItem key={'desc'} value={'desc'} >
                  Descending
                </SelectItem>
              </Select>
              <div className='flex justify-end w-full px-1 py-1 m-auto'>
                <Button label="Reset" color="primary" endContent={<GrPowerReset />} type="button" onPress={() => { handleReset() }} />
              </div>
            </div>

          </CardBody>
        </Card>
        {/* : <>
            <div className="flex justify-center items-center text-center text-2xl font-bold">
              No Data Available
            </div>
          </>} */}
        <div className="flex justify-center lg:justify-between flex-wrap">
          {todoList.map((task: any) => (
            <TaskCard
              key={task.id}
              taskData={task}
            />
          ))}

        </div>
        {/* <TaskComments />
        <AttachmentUploader /> */}
      </div>
    </div>
    {drawerIsOpen === true && (

      <TaskForm
        isOpen={drawerIsOpen}
        toggleDrawer={() => setDrawerIsOpen(!drawerIsOpen)}
        taskData={null}
      />
    )}
  </>);
};

export default ToDoPage;
