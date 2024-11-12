interface AuthStateType {
    userData: object;
    isLoggedIn: boolean;
}

const initialAuthState: AuthStateType = {
    userData: {},
    isLoggedIn: false
}
export { initialAuthState }
export type { AuthStateType }