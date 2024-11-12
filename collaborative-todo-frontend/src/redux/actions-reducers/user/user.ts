
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialUserState: any = {
    getAllRegularAndTeamLeadUsers: [],
    getAllRegularAndTeamLeadUsersPagination: {
        totalRecords: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10
    },
    getAllRegularAndTeamLeadUsersLoading: false,
    getAllRegularUsers: [],
    getAllRegularUsersLoading: false,
    getAllAssignedUserUnderTeamLeader: [],
    getAllAssignedUserUnderTeamLeaderLoading: false,
    getAllTeamLeadersUnderRegularUser: [],
    getAllTeamLeadersUnderRegularUserLoading: false,
    getAllTeamLeadersAndRegularMemberUsersUnderRegularUser: [],
    getAllTeamLeadersAndRegularMemberUsersUnderRegularUserLoading: false,
    getAllRegularUsersUnderTeamLeader: [],
    getAllRegularUsersUnderTeamLeaderLoading: false,
    getAllUsers: [],
    // getAllUsersPagination: {
    //     totalRecords: 0,
    //     totalPages: 1,
    //     currentPage: 1,
    //     pageSize: 10
    // },
    getAllUsersLoading: false
}

export const User = createSlice({
    name: 'User',
    initialState: initialUserState,
    reducers: {
        handleGetAllRegularAndTeamLeadUsersRequest: (state, action) => {
            state.getAllRegularAndTeamLeadUsersLoading = true
        },
        handleGetAllRegularAndTeamLeadUsersResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const allUsers: any = action.payload
                    if (allUsers && Object.keys(allUsers).length > 0) {
                        const { data, pagination } = allUsers
                        if (data && Array.isArray(data) && data.length > 0) {
                            state.getAllRegularAndTeamLeadUsers = data
                            state.getAllRegularAndTeamLeadUsersPagination = pagination
                        }
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: "copy" });
                } else {
                    toast.error('An unknown error occurred.', { id: "copy" });
                }
            }
            state.getAllRegularAndTeamLeadUsersLoading = false
        },
        handleGetAllRegularUsersRequest: (state) => {
            state.getAllRegularUsersLoading = true
        },
        handleGetAllRegularUsersResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const allRegularUsers: any = action.payload
                    if (allRegularUsers && Array.isArray(allRegularUsers) && allRegularUsers.length > 0) {
                        state.getAllRegularUsers = allRegularUsers
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: "copy" });
                } else {
                    toast.error('An unknown error occurred.', { id: "copy" });
                }
            }
            state.getAllRegularUsersLoading = false
        },
        handleGetAllAssignedUserUnderTeamLeaderRequest: (state, action) => {
            state.getAllAssignedUserUnderTeamLeaderLoading = true
        },
        handleGetAllAssignedUserUnderTeamLeaderResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const allAssignedUserUnderTeamLeader: any = action.payload
                    if (allAssignedUserUnderTeamLeader && Array.isArray(allAssignedUserUnderTeamLeader) && allAssignedUserUnderTeamLeader.length > 0) {
                        state.getAllAssignedUserUnderTeamLeader = allAssignedUserUnderTeamLeader
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: "copy" });
                } else {
                    toast.error('An unknown error occurred.', { id: "copy" });
                }
            }
            state.getAllAssignedUserUnderTeamLeaderLoading = false
        },
        handleGetAllTeamLeadersUnderRegularUserRequest: (state) => {
            state.getAllTeamLeadersUnderRegularUserLoading = true
        },
        handleGetAllTeamLeadersUnderRegularUserResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const allTeamLeadersUnderRegularUser: any = action.payload
                    if (allTeamLeadersUnderRegularUser && Array.isArray(allTeamLeadersUnderRegularUser) && allTeamLeadersUnderRegularUser.length > 0) {
                        state.getAllTeamLeadersUnderRegularUser = allTeamLeadersUnderRegularUser
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: "copy" });
                } else {
                    toast.error('An unknown error occurred.', { id: "copy" });
                }
            }
            state.getAllTeamLeadersUnderRegularUserLoading = false
        },
        handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserRequest: (state) => {
            state.getAllTeamLeadersAndRegularMemberUsersUnderRegularUserLoading = true
        },
        handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const allTeamLeadersAndRegularMemberUsersUnderRegularUser: any = action.payload
                    if (allTeamLeadersAndRegularMemberUsersUnderRegularUser && Array.isArray(allTeamLeadersAndRegularMemberUsersUnderRegularUser) && allTeamLeadersAndRegularMemberUsersUnderRegularUser.length > 0) {
                        state.getAllTeamLeadersAndRegularMemberUsersUnderRegularUser = allTeamLeadersAndRegularMemberUsersUnderRegularUser
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: "copy" });
                } else {
                    toast.error('An unknown error occurred.', { id: "copy" });
                }
            }
            state.getAllTeamLeadersAndRegularMemberUsersUnderRegularUserLoading = false
        },
        handleGetAllRegularUsersUnderTeamLeaderRequest: (state) => {
            state.getAllRegularUsersUnderTeamLeaderLoading = true
        },
        handleGetAllRegularUsersUnderTeamLeaderResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const allRegularUsersUnderTeamLeader: any = action.payload
                    if (allRegularUsersUnderTeamLeader && Array.isArray(allRegularUsersUnderTeamLeader) && allRegularUsersUnderTeamLeader.length > 0) {
                        state.getAllRegularUsersUnderTeamLeader = allRegularUsersUnderTeamLeader
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: "copy" });
                } else {
                    toast.error('An unknown error occurred.', { id: "copy" });
                }
            }
            state.getAllRegularUsersUnderTeamLeaderLoading = false
        },
        handleGetAllUsersRequest: (state, action) => {
            state.getAllUsersLoading = true
        },
        handleGetAllUsersResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const allUsers = action.payload
                    if (allUsers && Object.keys(allUsers).length > 0) {
                        const { data }: any = allUsers
                        if (data && Array.isArray(data) && data.length > 0) {
                            state.getAllUsers = data
                            // state.getAllUsersPagination = pagination
                        }
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: "copy" });
                } else {
                    toast.error('An unknown error occurred.', { id: "copy" });
                }
            }
            state.getAllUsersLoading = false
        }
    }
})

export const {
    handleGetAllRegularAndTeamLeadUsersRequest,
    handleGetAllRegularUsersRequest,
    handleGetAllAssignedUserUnderTeamLeaderRequest,
    handleGetAllTeamLeadersUnderRegularUserRequest,
    handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserRequest,
    handleGetAllRegularUsersUnderTeamLeaderRequest,
    handleGetAllUsersRequest,
} = User.actions

export default User.reducer

