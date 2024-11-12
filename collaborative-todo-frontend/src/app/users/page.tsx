"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor
} from "@nextui-org/react";
import { SVGProps } from "react";
import { PlusIcon } from "@/assets/icon/PlusIcon";
import { VerticalDotsIcon } from "@/assets/icon/VerticalDotsIcon";
import SearchIcon from "@/assets/icon/SearchIcon";
import { ChevronDownIcon } from "@/assets/icon/ChevronDownIcon";
import { handleGetAllRegularAndTeamLeadUsersRequest } from "@/redux/actions-reducers/user/user";
import { useDispatch, useSelector } from 'react-redux';
import { debounce, getDateFromISO8601 } from "@/utils/utility";
import View from "@/components/User/View";
import fetchApi from "@/utils/fetchApi";
import toast from "react-hot-toast";
import AssignUser from "@/components/User/AssignUser";
import { GrPowerReset } from "react-icons/gr";

const columns = [
    // { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "ROLE", uid: "userRole", sortable: true },
    { name: "Created At", uid: "createdAt", sortable: true },
    { name: "Updated At", uid: "updatedAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

export default function App() {
    const dispatch = useDispatch()
    const {
        getAllRegularAndTeamLeadUsers,
        getAllRegularAndTeamLeadUsersLoading,
        getAllRegularAndTeamLeadUsersPagination
    } = useSelector((state: any) => state.User)
    const {
        currentPage,
        pageSize,
        totalPages,
        totalRecords
    } = getAllRegularAndTeamLeadUsersPagination

    const [userData, setUserData] = useState({})
    const [viewDrawerIsOpen, setViewDrawerIsOpen] = useState(false)
    const [page, setPage] = useState(currentPage);
    const [rowsPerPage, setRowsPerPage] = React.useState(pageSize);
    const [totalPage, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = React.useState<Selection>(new Set([]));
    const userRoleSelectedValue = useMemo(
        () => Array.from(userRoleFilter).join(", ").replaceAll("_", " "),
        [userRoleFilter]
    );
    const [flag, setFlag] = useState(false);
    const [assignUserModalIsOpen, setAssignUserModalIsOpen] = useState(false);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});

    useEffect(() => {
        setTotalPages(totalPages)
    }, [totalPages])

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function handleUnderscore(str: string) {
        return str.replace(/-/g, " ");
    }

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await fetchApi({
                endpoint: `/api/users/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.statusCode === 200) {
                toast.success(response.message);
                setFlag(!flag)
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

    const renderCell = useCallback((rowItem: any, columnKey: any) => {

        const handleMultipleDotInColumnKey = (columnKey: string) => {
            if (columnKey.includes(".")) {
                const splittedColumnKey = columnKey.split(".");
                return splittedColumnKey
            }
            return columnKey;
        }

        const colKey = handleMultipleDotInColumnKey(columnKey)
        let cellValue: any;
        if (Array.isArray(colKey)) {
            const remainingColKey = colKey.slice(1).join(".")
            cellValue = rowItem[colKey[0]][remainingColKey];
        } else {
            cellValue = rowItem[columnKey];
        }

        switch (columnKey) {
            case "createdAt":
            case "updatedAt":
                return (
                    <div>
                        {getDateFromISO8601({ isoDate: cellValue })}
                    </div>
                );
            case "userRole":
                return (
                    <div>{capitalize(handleUnderscore(cellValue))}</div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button

                                    isIconOnly={true} size="sm" variant="light" >
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                onAction={(key) => {
                                    if (key === "delete") {
                                        handleDeleteUser(rowItem.id);
                                    }

                                    if (key === 'assign-user') {
                                        setAssignUserModalIsOpen(true)
                                        setUserData(rowItem)
                                    }

                                    if (key === 'view') {
                                        setUserData(rowItem)
                                        setViewDrawerIsOpen(true)

                                    }
                                }}
                            >
                                <DropdownItem key={"view"}>View</DropdownItem>
                                <DropdownItem className={rowItem.userRole === "teamlead" ? "block" : "hidden"} key={"assign-user"}>Assign User</DropdownItem>
                                <DropdownItem key={"delete"}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);
    const onNextPage = React.useCallback(() => {
        if (page < totalPage) {
            setPage(page + 1);
        }
    }, [page, totalPage]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onClear = React.useCallback(() => {
        setUserData({})
        setPage(1)
        setRowsPerPage(10)
        setTotalPages(1)
        setSearch("")
        setUserRoleFilter(new Set([]))
        setSortDescriptor({})
        setFlag(!flag)
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between flex-wrap gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search..."
                        startContent={<SearchIcon />}
                        value={search}
                        onClear={() => onClear()}
                        onValueChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                    />
                    <div className="flex flex-wrap gap-3">
                        <Dropdown>
                            <DropdownTrigger className="">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    {userRoleSelectedValue ? capitalize(handleUnderscore(userRoleSelectedValue)) : "User Role"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                selectionMode="single"
                                aria-label="Table Columns"
                                selectedKeys={userRoleFilter}
                                onSelectionChange={setUserRoleFilter}
                            >

                                <DropdownItem key={"regular-user"} >
                                    Regular User
                                </DropdownItem>
                                <DropdownItem key={"teamlead"}>
                                    Team Lead
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<GrPowerReset />} type="button" onPress={onClear}>
                            Reset
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center flex-wrap">
                    <div className="text-default-400 mr-4 text-small">Total {totalRecords} records </div>

                    <div className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                            value={rowsPerPage}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }, [
        search,
        setSearch,
        userRoleFilter,
        userRoleSelectedValue,
        onRowsPerPageChange,
        rowsPerPage,
        getAllRegularAndTeamLeadUsers.length,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">

                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPage}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={totalPage === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={totalPage === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [page, totalPage, rowsPerPage]);

    const handleApiCall = (props: { page: number, limit: number, search?: string, userRole?: string, sortBy?: string, sortOrder?: string }) => {
        dispatch(handleGetAllRegularAndTeamLeadUsersRequest(props))
    }

    const debounceHandleApiCall = useCallback(debounce(handleApiCall, 500), [])

    useEffect(() => {
        debounceHandleApiCall({
            page: page,
            limit: rowsPerPage,
            search,
            userRole: userRoleSelectedValue,
            sortBy: sortDescriptor.column ? sortDescriptor.column.toString() : undefined,
            sortOrder: sortDescriptor.direction ? sortDescriptor.direction === "ascending" ? "asc" : "desc" : undefined
        })

    }, [flag, page, rowsPerPage, search, userRoleSelectedValue, sortDescriptor])

    return (<>
        <div className="m-2 sm:mx-10">
            <div className="text-3xl font-bold text-primary-500 mb-6">Users</div>
            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                bottomContent={bottomContent}

                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                onSortChange={setSortDescriptor}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "end" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No users found"}
                    items={getAllRegularAndTeamLeadUsers}
                >
                    {(item: any) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        {viewDrawerIsOpen === true && (<>
            <View
                isOpen={viewDrawerIsOpen}
                toggleDrawer={() => {
                    setViewDrawerIsOpen(!viewDrawerIsOpen)
                    setUserData({})
                }}
                userData={userData}
            />
        </>)}
        {assignUserModalIsOpen === true && (<>
            <AssignUser
                isOpen={assignUserModalIsOpen}
                onClose={() => {
                    setAssignUserModalIsOpen(!assignUserModalIsOpen)
                    setUserData({})
                }}
                userData={userData}
            />
        </>)}
    </>);
}
