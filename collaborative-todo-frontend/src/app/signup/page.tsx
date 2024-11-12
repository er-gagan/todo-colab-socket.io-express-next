"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, } from 'next/navigation';
import Link from 'next/link';
import EyeSlashFilledIcon from '@/assets/icon/EyeSlashFilledIcon';
import EyeFilledIcon from '@/assets/icon/EyeFilledIcon';
import { handleNavigation } from '@/utils/utility';
import toast from 'react-hot-toast';
import Button from '@/components/Button';
import Input from '@/components/Input';
import fetchApi from '@/utils/fetchApi';

import UserRoleComponent from '@/components/UserRole';

const Signup = () => {
    const router = useRouter();

    const [isVisible, setIsVisible] = React.useState(false);
    const [load, setLoad] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoad(true);
        try {
            e.preventDefault();
            if (!name || !email || !password || !userRole) {
                setError('Please fill in all fields');

            } else {
                const response = await fetchApi({
                    endpoint: '/api/auth/register',
                    method: 'POST',
                    payload: { name, email, password, userRole },
                });
                if (response.statusCode === 201) {
                    setError('');
                    toast.success(response.message, { id: "copy" });
                    handleNavigation({ path: '/login', router })
                } else {
                    toast.error(response.message, { id: "copy" });
                }
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
        <div className="flex justify-center items-center h-[80vh] mt-10">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg w-11/12 sm:w-1/2 md:w-2/6">
                <div className='mb-6'>
                    <h1 className="text-2xl font-bold">Sign Up</h1>
                    <small>Please fill in all fields</small>
                </div>
                <div className="mb-4">
                    <UserRoleComponent required={true} setUserRole={setUserRole}
                        userRole={userRole}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        isRequired={true}
                        required={true}
                        type="text"
                        label="Name"
                        id="name"
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                    />
                </div>
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
                        Already have an account? <Link href="/login"
                            onClick={e => {
                                e.preventDefault();
                                handleNavigation({ path: '/login', router })
                            }}
                            className="text-blue-500">Login</Link>
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
                    label='SignUp'
                />
            </form>
        </div>
    );
};
export default Signup;
