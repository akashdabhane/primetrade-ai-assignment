'use client';
import React, { useState, useContext } from 'react';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { baseUrl } from '../../utils/helper';
import { loginSchema } from '../../validation-schema/login-schema';
import { useFormik } from "formik";
import Cookies from 'js-cookie';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useRouter();

    // using formik for handling input fields
    const initialValues = {
        email: "",
        password: "",
    };

    // values, handleBlur, handleChange, handleSubmit, errors, touched
    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        validateOnChange: true,
        validateOnBlur: false,
        // By disabling validation onChange and onBlur formik will validate on submit.
        onSubmit: (values, action) => {
            handleLogin(values);

            action.resetForm();
        }
    })

    const handleLogin = async (formData) => {
        try {
            console.log(formData)
            const data = await axios.post(`${baseUrl}/users/login`, formData);
            
            console.log(data.data.data)
            Cookies.set('isLogin', 'true', { expires: 7 });
            Cookies.set('accessToken', data.data.data.accessToken)
            Cookies.set('isAdmin', data.data.data.loggedInUser.isAdmin)

            navigate.push('/')
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }


    return (
        <div className='w-full h-screen py-24'>
            <div className='mx-4 md:m-auto text-black bg-white p-6 md:w-[36%] h-[36rem] rounded-md  align-middle py-20 space-y-6'>
                <h2 className="heading mx-4 md:mx-24 text-2xl font-bold">Login</h2>
                <span className='mx-4 md:mx-24 text-sm text-red-600'>{error}</span>
                <form className='text-start mx-4 md:mx-24 space-y-4' onSubmit={formik.handleSubmit}>
                    <div className="">
                        <input type="text" name='email' inputMode='numeric' placeholder='Enter email'
                            className='border w-full p-4 outline-none'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {
                            (formik.touched.email && formik.errors.email) && (
                                <p className="text-red-600 text-xs">{formik.errors.email}</p>
                            )
                        }
                    </div>

                    <div className="">
                        <div className="flex items-center align-middle border w-full">
                            <input type={`${showPassword ? 'text' : 'password'}`} name='password' placeholder='Password' autoComplete='false'
                                className='outline-none p-4 w-full'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <div className="text-2xl px-2 cursor-pointer ">
                                {showPassword ? <FaEyeSlash onClick={() => setShowPassword(false)} /> : <FaEye onClick={() => setShowPassword(true)} />}
                            </div>
                        </div>
                        {
                            (formik.touched.password && formik.errors.password) && (
                                <p className="text-red-600 text-xs">{formik.errors.password}</p>
                            )
                        }
                    </div>

                    <div className="flex justify-between text-sm">
                        <div className="">
                            <input type="checkbox" name="staySign" id="staySigned" />
                            <label htmlFor="staySigned">Stay Signed In</label>
                        </div>
                        <span className='text-blue-600 cursor-pointer' onClick={() => navigate.push('/forget-password')}>Forget Password?</span>
                    </div>

                    <button type='submit' className='bg-black w-full text-white p-4 font-semibold my-12' >
                        Login
                    </button>
                </form>

                <div className="mx-6 md:mx-24 text-sm space-x-2 -mt-10">
                    <span>New to platform?</span>
                    <Link href='/register' className='text-blue-600'>Register</Link>
                </div>
            </div>
        </div>
    )
}