
import fetchApi from '@/utils/fetchApi';
import toast from 'react-hot-toast';
import { call, put, takeEvery } from 'redux-saga/effects';

function* handleGetUserDataRequest(): Generator<any, void, Response> {
    try {

        const response: any = yield call(fetchApi, {
            method: "GET",
            endpoint: `/api/auth/get-user-data`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "Auth/handleGetUserDataResponse", payload: jsonDataTyped.data });
        } else {
            yield put({ type: "Auth/handleGetUserDataResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            // toast.error(error.message, { id: "copy" });
        } else {
            // toast.error('An unknown error occurred', { id: "copy" });
        }
        yield put({ type: "Auth/handleGetUserDataResponse", payload: null });
    }
}

export function* AuthSaga(): Generator<any> {
    yield takeEvery('Auth/handleGetUserDataRequest', handleGetUserDataRequest);
}
