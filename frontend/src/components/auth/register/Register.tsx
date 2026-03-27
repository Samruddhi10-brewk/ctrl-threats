import { FaApple } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { registerSchema } from "../../../constants/validations/registerSchema";
import { registerUser } from "../../../api/auth";
import toast from "react-hot-toast";
import { Spinner } from "flowbite-react";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import microsoftLogo from '/logos_microsoft-icon.png';
import OAuth from "../OAuth";
import { ApiError } from "../../../types/errors";

interface RegisterFormValues {
    username: string,
    email: string;
    password: string;
    confirm_password: string;
}

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassowrd] = useState(false);
    const router = useNavigate();

    const initialValues: RegisterFormValues = {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const handleSubmit = async (
        values: RegisterFormValues,
        { setSubmitting, setFieldError }: { setSubmitting: (isSubmitting: boolean) => void, setFieldError: (field: string, message: string) => void }
    ) => {
        try {
            const { email, password, confirm_password, username } = values;
            await registerUser({ email, password, confirm_password, username });
            toast.success("Registration successful! Please login to continue");
            router("/login");
        } catch (error: unknown) {
            const err = error as ApiError;
            if (err.response?.data) {
                const { field, message } = err.response.data;
                if (field && message) {
                    setFieldError(field, message);
                    toast.error(message);
                } else {
                    toast.error(message || "Registration failed");
                }
            } else {
                toast.error("Registration failed, please try again");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen px-2 md:pt-0 py-10 bg-[linear-gradient(-270deg,_#4D00CD_25%,_#5D05EC_1000%)]`}>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={registerSchema}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-5 w-full max-w-[30rem] rounded-xl p-8 border border-slate-500/60  bg-white">
                        <div className="flex flex-col py-5 items-center">
                            <div className="flex justify-center mb-10">
                                <img
                                    src="/Layer 1.png"
                                />
                            </div>
                            <span className="text-sm font-normal">
                                Already have an account?{" "}
                                <Link to="/login" className={`font-bold text-[#5D01F6]`}>
                                    Login
                                </Link>
                            </span>
                        </div>
                        <hr className="border-t border-gray-300" />
                        <div className="relative bg-inherit">
                            <Field
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Full name"
                                className="text-black peer bg-transparent h-10 rounded-lg  placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-gray-600 focus:outline-none focus:border-rose-600 w-full"
                            />
                            <label htmlFor="username" className="absolute cursor-text left-0 -top-3 text-sm bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-white peer-focus:text-sm transition-all !text-black !bg-white">
                                Full Name
                            </label>
                            <div className="min-h-[1.5rem]">
                                <ErrorMessage
                                    name="username"
                                    component="span"
                                    className="text-red-500 text-xs"
                                />
                            </div>
                        </div>
                        <div className="relative bg-inherit">
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="text-black peer bg-transparent h-10 rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-gray-600 focus:outline-none focus:border-rose-600 w-full"
                            />
                            <label htmlFor="email" className="absolute cursor-text left-0 -top-3 text-sm bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-white peer-focus:text-sm transition-all !text-black !bg-white">
                                Email
                            </label>

                            <div className="min-h-[1.5rem]">
                                <ErrorMessage
                                    name="email"
                                    component="span"
                                    className="text-red-500 text-xs"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-inherit">
                            <span className="relative bg-inherit">
                                <span className="absolute right-2.5 sm:top-[9px] top-[9px]">
                                    {showPassword ?
                                        <IoEyeOff onClick={() => setShowPassword(!showPassword)} className="text-black text-2xl cursor-pointer"
                                        /> :
                                        <MdRemoveRedEye
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-black text-2xl cursor-pointer"
                                        />
                                    }

                                </span>
                                <Field
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-gray-600 focus:outline-none focus:border-rose-600 w-full"
                                />
                                <label htmlFor="password" className="absolute cursor-text left-0 -top-3 text-sm bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-white peer-focus:text-sm transition-all !text-black !bg-white">
                                    Password
                                </label>

                                <div className="min-h-[1.5rem]">
                                    <ErrorMessage
                                        name="password"
                                        component="span"
                                        className="text-red-500 text-xs"
                                    />
                                </div>
                            </span>
                            <span className="relative bg-inherit">
                                <span className="absolute right-2.5 sm:top-[9px] top-[9px]">
                                    {showConfirmPassword ?
                                        <IoEyeOff onClick={() => setShowConfirmPassowrd(!showConfirmPassword)} className="text-black text-2xl cursor-pointer"
                                        /> :
                                        <MdRemoveRedEye
                                            onClick={() => setShowConfirmPassowrd(!showConfirmPassword)}
                                            className="text-black text-2xl cursor-pointer"
                                        />
                                    }

                                </span>
                                <Field
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-gray-600 focus:outline-none focus:border-rose-600 w-full"
                                />
                                <label htmlFor="confirm_password" className="absolute cursor-text left-0 -top-3 text-sm  bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-white peer-focus:text-sm transition-all !text-black !bg-white">
                                    Confirm Password
                                </label>


                                <div className="min-h-[1.5rem]">
                                    <ErrorMessage
                                        name="confirm_password"
                                        component="span"
                                        className="text-red-500 text-xs"
                                    />
                                </div>
                            </span>

                        </div>

                        <button type="submit" disabled={isSubmitting} className="py-2 rounded-full font-semibold bg-[#5D01F6]  w-full text-white flex justify-center items-center">{isSubmitting ? <div className='flex justify-center items-center gap-2'>
                            <Spinner className='h-5 w-5' />
                            <p>Loading</p>
                        </div> : <div>Sign Up</div>}</button>
                        <div className="mt-6 border-t pt-5 text-center">
                            <p className="text-lg text-gray-500">- OR -</p>
                            <div className="flex justify-center space-x-4 mt-6">
                                <button className="text-gray-600 hover:text-purple-500 flex items-center">
                                    <OAuth />
                                </button>
                                <button className="text-gray-600 hover:text-purple-500 flex items-center">
                                    <FaApple className="mr-4" size={30} />
                                </button>
                                <button className="text-gray-600 hover:text-purple-500 flex items-center">
                                    <img
                                        src={microsoftLogo}
                                        alt="Microsoft Logo"
                                        className="h-6 w-6 mr-4"
                                    />
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Register;