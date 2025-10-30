'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import { baseUrl } from '../../utils/helper';
import { registrationSchema } from '../../validation-schema/registration-schema';
import { useFormik } from "formik";


export default function Register() {
    const [error, setError] = useState('');
    const router = useRouter();

    // using formik for handling input fields
    const initialValues = {
        email: "",
        password: "",
        confirmPassword: "",
    };

    // values, handleBlur, handleChange, handleSubmit, errors, touched
    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        validateOnChange: true,
        validateOnBlur: false,
        // By disabling validation onChange and onBlur formik will validate on submit.
        onSubmit: (values, action) => {
            handleRegistration(values);

            action.resetForm();
        }
    })


    const handleRegistration = async (formData) => {
        try {
            console.log(formData)
            const response = await axios.post(`${baseUrl}/users/register`, formData);

            router.push('/login');
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }


    return (
        <div className='w-full h-[100vh] py-2' >
            <main className='md:mx-auto text-black bg-white p-6 mx-4 md:w-[36%] h-[38rem] rounded-md my-[2rem] align-middle py-14 space-y-6'>
                <h2 className="heading mx-4 md:mx-24 text-2xl font-bold">Register</h2>
                <span className='mx-4 md:mx-24 text-sm text-red-600'>{error}</span>
                <form onSubmit={formik.handleSubmit} className='text-start mx-4 md:mx-24 space-y-4'>
                    <div className="">
                        <input type="email" name='email' placeholder='Enter email'
                            className='border-[1px] w-full p-4 outline-none'
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
                        <input type='password' name='password' placeholder='Password' autoComplete='false'
                            className='outline-none p-4 w-full border-[1px] '
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {
                            (formik.touched.password && formik.errors.password) && (
                                <p className="text-red-600 text-xs">{formik.errors.password}</p>
                            )
                        }
                    </div>

                    <div className="">
                        <input type='password' name='confirmPassword' placeholder='Repeat password' autoComplete='false'
                            className='outline-none p-4 w-full border-[1px]'
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {
                            (formik.touched.confirmPassword && formik.errors.confirmPassword) && (
                                <p className="text-red-600 text-xs">{formik.errors.confirmPassword}</p>
                            )
                        }
                    </div>

                    <button type='submit' className={'bg-black w-full cursor-pointer text-white p-4 font-semibold my-12'} >
                        Register
                    </button>
                </form>

                <div className="mx-6 md:mx-24 text-sm -mt-10">
                    <span> Already have account?</span>
                    <Link href='/login' className='text-blue-600'> Login</Link>
                </div>
            </main>
        </div>
    )
}