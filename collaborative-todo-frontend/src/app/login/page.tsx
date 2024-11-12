"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EyeSlashFilledIcon from '@/assets/icon/EyeSlashFilledIcon';
import EyeFilledIcon from '@/assets/icon/EyeFilledIcon';
import { handleNavigation } from '@/utils/utility';
import toast from 'react-hot-toast';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useDispatch } from 'react-redux';
import { handleGetUserDataRequest } from '@/redux/actions-reducers/auth/auth';
import fetchApi from '@/utils/fetchApi';

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const [load, setLoad] = useState(false)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoad(true);
        try {
            e.preventDefault();
            if (!email || !password) {
                setError('Please fill in all fields');
                return;
            }

            const response = await fetchApi({
                method: 'POST',
                endpoint: '/api/auth/login',
                payload: { email, password },
            });
            if (response.statusCode === 200) {
                setError('');
                toast.success(response.message, { id: "copy" });
                localStorage.setItem('token', response.data.token);
                dispatch(handleGetUserDataRequest())
                handleNavigation({ path: '/', router })
            } else {
                toast.error(response.message, { id: "copy" });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, { id: "copy" });
            } else {
                toast.error('An unknown error occurred', { id: "copy" });
            }
        }
        setLoad(false);
    };


    return (
        <div className="flex justify-center items-center h-[80vh]">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg w-11/12 sm:w-1/2 md:w-2/6">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <div className="mb-4">
                    <Input
                        isRequired={true}
                        required={true}
                        type="email"
                        label="Email"
                        id="email"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-2">
                    <Input
                        isRequired={true}
                        required={true}
                        label="Password"
                        variant="bordered"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                    />
                </div>
                <div className='text-right'>
                    <small>
                        Don't have an account? <Link
                            href="/signup"
                            onClick={e => {
                                e.preventDefault();
                                handleNavigation({ path: "/signup", router })
                            }}
                            className="text-blue-500">Sign up</Link>
                    </small>
                </div>
                <div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                </div>
                <Button
                    type="submit"
                    color="primary"
                    variant="solid"
                    aria-label="Login"
                    aria-describedby="login-button"
                    isLoading={load}
                    radius="sm"
                    size="md"
                    fullWidth={true}
                    label='Login'
                />
            </form>
        </div>
    );
};
export default Login;
