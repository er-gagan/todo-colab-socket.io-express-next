
import fetchApi from '@/utils/fetchApi';
import toast from 'react-hot-toast';
import { call, put, takeEvery } from 'redux-saga/effects';
import qs from "qs"
function* handleGetAllTodosRequest(props: any): Generator<any, void, Response> {
    try {
        const params = qs.stringify(props.payload)
        const response: any = yield call(fetchApi, {
            method: "GET",
            endpoint: `/api/todos?${params}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string, pagination: object };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "Todo/handleGetAllTodosResponse", payload: { data: jsonDataTyped.data, pagination: jsonDataTyped.pagination } });
        } else {
            yield put({ type: "Todo/handleGetAllTodosResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { id: "copy" });
        } else {
            toast.error('An unknown error occurred', { id: "copy" });
        }
        yield put({ type: "Todo/handleGetAllTodosResponse", payload: null });
    }
}


export function* TodoSaga(): Generator<any> {
    yield takeEvery('Todo/handleGetAllTodosRequest', handleGetAllTodosRequest);
}
