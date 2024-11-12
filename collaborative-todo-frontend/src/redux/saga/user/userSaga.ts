
import fetchApi from '@/utils/fetchApi';
import toast from 'react-hot-toast';
import { call, put, takeEvery } from 'redux-saga/effects';
import qs from "qs"
function* handleGetAllRegularAndTeamLeadUsersRequest(props: any): Generator<any, void, Response> {
    try {
        const params = qs.stringify(props.payload)
        const response: any = yield call(fetchApi, {
            method: "GET",
            endpoint: `/api/users/get-all-regular-teamlead-users?${params}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string, pagination: object };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "User/handleGetAllRegularAndTeamLeadUsersResponse", payload: { data: jsonDataTyped.data, pagination: jsonDataTyped.pagination } });
        } else {
            yield put({ type: "User/handleGetAllRegularAndTeamLeadUsersResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { id: "copy" });
        } else {
            toast.error('An unknown error occurred', { id: "copy" });
        }
        yield put({ type: "User/handleGetAllRegularAndTeamLeadUsersResponse", payload: null });
    }
}

function* handleGetAllRegularUsersRequest(): Generator<any, void, Response> {
    try {

        const response: any = yield call(fetchApi, {
            method: "GET",
            endpoint: `/api/users/get-all-regular-users`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "User/handleGetAllRegularUsersResponse", payload: jsonDataTyped.data });
        } else {
            yield put({ type: "User/handleGetAllRegularUsersResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { id: "copy" });
        } else {
            toast.error('An unknown error occurred', { id: "copy" });
        }
        yield put({ type: "User/handleGetAllRegularUsersResponse", payload: null });
    }
}

function* handleGetAllAssignedUserUnderTeamLeaderRequest(props: any): Generator<any, void, Response> {
    try {

        const { teamLeadId } = props.payload
        console.log("props", props);
        console.log("teamLeadId", teamLeadId);
        const response: any = yield call(fetchApi, {
            method: "POST",
            endpoint: `/api/users/get-all-assigned-users`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            payload: { teamLeadId }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "User/handleGetAllAssignedUserUnderTeamLeaderResponse", payload: jsonDataTyped.data });
        } else {
            yield put({ type: "User/handleGetAllAssignedUserUnderTeamLeaderResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { id: "copy" });
        } else {
            toast.error('An unknown error occurred', { id: "copy" });
        }
        yield put({ type: "User/handleGetAllAssignedUserUnderTeamLeaderResponse", payload: null });
    }
}

function* handleGetAllTeamLeadersUnderRegularUserRequest(): Generator<any, void, Response> {
    try {

        const response: any = yield call(fetchApi, {
            method: "GET",
            endpoint: `/api/users/get-all-team-leaders-under-regular-user`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "User/handleGetAllTeamLeadersUnderRegularUserResponse", payload: jsonDataTyped.data });
        } else {
            yield put({ type: "User/handleGetAllTeamLeadersUnderRegularUserResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { id: "copy" });
        } else {
            toast.error('An unknown error occurred', { id: "copy" });
        }
    }
}

function* handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserRequest(): Generator<any, void, Response> {
    try {

        const response: any = yield call(fetchApi, {
            method: "GET",
            endpoint: `/api/users/get-all-team-leaders-and-regular-member-users-under-regular-user`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "User/handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserResponse", payload: jsonDataTyped.data });
        } else {
            yield put({ type: "User/handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { id: "copy" });
        } else {
            toast.error('An unknown error occurred', { id: "copy" });
        }
    }
}

function* handleGetAllRegularUsersUnderTeamLeaderRequest(): Generator<any, void, Response> {
    try {

        const response: any = yield call(fetchApi, {
            method: "GET",
            endpoint: `/api/users/get-all-regular-users-under-team-leader`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "User/handleGetAllRegularUsersUnderTeamLeaderResponse", payload: jsonDataTyped.data });
        } else {
            yield put({ type: "User/handleGetAllRegularUsersUnderTeamLeaderResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { id: "copy" });
        } else {
            toast.error('An unknown error occurred', { id: "copy" });
        }
    }
}

function* handleGetAllUsersRequest(props: any): Generator<any, void, Response> {
    try {
        const params = qs.stringify(props.payload)
        const response: any = yield call(fetchApi, {
            method: "GET",
            endpoint: `/api/users?${params}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const jsonDataTyped = response as { data: object, statusCode: number, message: string, pagination: object };
        if (jsonDataTyped.statusCode === 200) {
            yield put({ type: "User/handleGetAllUsersResponse", payload: { data: jsonDataTyped.data, pagination: jsonDataTyped.pagination } });
        } else {
            yield put({ type: "User/handleGetAllUsersResponse", payload: null });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { id: "copy" });
        } else {
            toast.error('An unknown error occurred', { id: "copy" });
        }
    }
}

export function* UserSaga(): Generator<any> {
    yield takeEvery('User/handleGetAllRegularAndTeamLeadUsersRequest', handleGetAllRegularAndTeamLeadUsersRequest);
    yield takeEvery('User/handleGetAllRegularUsersRequest', handleGetAllRegularUsersRequest);
    yield takeEvery('User/handleGetAllAssignedUserUnderTeamLeaderRequest', handleGetAllAssignedUserUnderTeamLeaderRequest);
    yield takeEvery('User/handleGetAllTeamLeadersUnderRegularUserRequest', handleGetAllTeamLeadersUnderRegularUserRequest);
    yield takeEvery('User/handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserRequest', handleGetAllTeamLeadersAndRegularMemberUsersUnderRegularUserRequest);
    yield takeEvery('User/handleGetAllRegularUsersUnderTeamLeaderRequest', handleGetAllRegularUsersUnderTeamLeaderRequest);
    yield takeEvery('User/handleGetAllUsersRequest', handleGetAllUsersRequest);
}
