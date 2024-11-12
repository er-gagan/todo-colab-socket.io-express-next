
import { put, takeEvery, all, call } from 'redux-saga/effects'
import { AuthSaga } from './saga/auth/authSaga'
import { UserSaga } from './saga/user/userSaga'



export default function* rootSaga() {
    yield all([
        AuthSaga(),
        UserSaga(),
    ])
}