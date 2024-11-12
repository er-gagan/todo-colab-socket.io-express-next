
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { initialAuthState } from './initializeAuthState';
import { hideLoader, showLoader } from '@/utils/utility';

interface UserData {
    id: string;
    username: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export const Auth = createSlice({
    name: 'Auth',
    initialState: initialAuthState,
    reducers: {
        handleCheckUserIsLoggedin(state, payload) {
            const { isLoggedIn } = payload.payload
            if (isLoggedIn === true) {
                state.isLoggedIn = true
            } else {
                state.isLoggedIn = false
            }
        },
        handleResetAuthState(state) {
            state.isLoggedIn = false
            state.userData = {}
        },
        handleGetUserDataRequest: () => {
            showLoader()
        },
        handleGetUserDataResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const userData: UserData = action.payload
                    if (userData) {
                        state.userData = userData
                        state.isLoggedIn = true
                    }
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message, { id: "copy" });
                } else {
                    toast.error('An unknown error occurred.', { id: "copy" });
                }
            }
            hideLoader()
        },
    }
})

export const {
    handleGetUserDataRequest,
    handleCheckUserIsLoggedin,
    handleResetAuthState
} = Auth.actions

export default Auth.reducer

