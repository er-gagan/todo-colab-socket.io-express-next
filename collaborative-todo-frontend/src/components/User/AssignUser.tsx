"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, SelectItem, Select, Avatar } from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { handleGetAllAssignedUserUnderTeamLeaderRequest, handleGetAllRegularUsersRequest } from '@/redux/actions-reducers/user/user';
import fetchApi from '@/utils/fetchApi';
import toast from 'react-hot-toast';
import { debounce } from '@/utils/utility';

const AssignUser = (props: any) => {
    const dispatch = useDispatch()
    const {
        getAllRegularAndTeamLeadUsers,
        getAllRegularAndTeamLeadUsersLoading,
        getAllRegularUsers,
        getAllRegularUsersLoading,
        getAllAssignedUserUnderTeamLeader,
        getAllAssignedUserUnderTeamLeaderLoading
    } = useSelector((state: any) => state.User)
    const { isOpen, onClose, userData } = props
    const [assigningUser, setAssigningUser] = useState<any>(new Set([]))

    const handleApiCall = () => {
        dispatch(handleGetAllRegularUsersRequest())
    }

    const debounceHandleApiCall = useCallback(debounce(handleApiCall, 500), [])

    useEffect(() => {
        debounceHandleApiCall()
    }, [])

    useEffect(() => {
        if (getAllAssignedUserUnderTeamLeader && Array.isArray(getAllAssignedUserUnderTeamLeader) && getAllAssignedUserUnderTeamLeader.length > 0) {
            const allAssignedUserIds = getAllAssignedUserUnderTeamLeader.map((item: any) => String(item.id))
            setAssigningUser(new Set(allAssignedUserIds))
        }
    }, [getAllAssignedUserUnderTeamLeader])

    const handleGetAllAssignedUserUnderTeamLeader = ({ userData }: any) => {
        dispatch(handleGetAllAssignedUserUnderTeamLeaderRequest({ teamLeadId: userData.id }))
    }

    const debounceGetAllAssignedUserUnderTeamLeader = useCallback(debounce(handleGetAllAssignedUserUnderTeamLeader, 500), [])

    useEffect(() => {
        if (userData && userData.id) {
            debounceGetAllAssignedUserUnderTeamLeader({
                userData
            })
        }
    }, [userData])

    const handleAssignUser = async () => {
        try {

            const payload = {
                teamLeadId: userData.id,
                userIds: Array.from(assigningUser).filter((item: any) => item)
            }
            const response = await fetchApi({
                endpoint: '/api/users/assign-regular-users',
                method: 'POST',
                payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.statusCode === 200) {
                toast.success(response.message, { id: "copy" })
                setAssigningUser(new Set([]))
                onClose()
            } else {
                toast.error(response.message, { id: "copy" })
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: "copy" })
            } else {
                toast.error('An unknown error occurred', { id: "copy" })
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={(e) => {
            setAssigningUser(new Set([]))
            onClose(e)
        }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Assign User
                        </ModalHeader>
                        <ModalBody>
                            <div className='text-red-500 font-semibold'>
                                Important Note:
                            </div>
                            <div className='text-justify mb-4'>
                                You have selected <b>{userData.name}</b>, who is a <b>Team Leader</b>, and you are an <b>Admin</b> user. You can now assign multiple <b>Regular Users</b> under this <b>Team Leader</b>. Each <b>Team Leader</b> can have multiple <b>Regular Users</b>, and also each <b>Regular User</b> can have multiple <b>Team Leader</b>.
                            </div>
                            <Select
                                label="Regular User"
                                fullWidth={true}
                                placeholder="Select Regular User"
                                selectionMode="multiple"
                                items={getAllRegularUsers}
                                required={true}
                                isRequired={true}
                                isLoading={getAllAssignedUserUnderTeamLeaderLoading}
                                onChange={(e: any) => {
                                    setAssigningUser(new Set(e.target.value.split(",")));
                                }}
                                selectedKeys={assigningUser}
                            >
                                {(user: any) => (
                                    <SelectItem key={user.id} textValue={user.name}>
                                        <div className="flex gap-2 items-center">
                                            <Avatar showFallback src='https://images.unsplash.com/broken' />
                                            <div className="flex flex-col">
                                                <span className="text-small">{user.name}</span>
                                                <span className="text-tiny text-default-400">{user.email}</span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                )}

                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={() => {
                                handleAssignUser()
                            }}>
                                Assign
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default AssignUser