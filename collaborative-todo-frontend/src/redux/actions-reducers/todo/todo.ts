
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialTodoState: any = {
    getAllTodos: [],
    getAllTodosLoading: false,
    getAllTodosPagination: {
        totalRecords: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10
    }
}

export const Todo = createSlice({
    name: 'Todo',
    initialState: initialTodoState,
    reducers: {
        handleGetAllTodosRequest: (state, action) => {
            state.getAllTodosLoading = true
        },
        handleGetAllTodosResponse: (state, action: PayloadAction) => {
            try {
                if (action !== undefined && action !== null && action.payload) {
                    const allTodos: any = action.payload
                    if (allTodos && Object.keys(allTodos).length > 0) {
                        const { data, pagination } = allTodos
                        if (data && Array.isArray(data) && data.length > 0) {
                            state.getAllTodos = data
                            state.getAllTodosPagination = pagination
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
            state.getAllTodosLoading = false
        },
    }
})

export const {
    handleGetAllTodosRequest,
} = Todo.actions

export default Todo.reducer

