'use client';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { app } from '../../../firebase';
import { Spinner } from "flowbite-react";
const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const auth = getAuth(app);
    const sendPasswordResEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!email.length) {
                toast.error("Enter a valid email");
                return
            }
            setLoading(true);
            // const actionCodeSettings = {
            //     url: `${process.env.NEXT_PUBLIC_TESTING_API}/?email=${email}`,
            //     handleCodeInApp: true
            // };
            await sendPasswordResetEmail(auth, email);
            toast.success("Email Sent Successfully");
        } catch (e) {
            toast.error("Email Couldn't be Sent");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={(e) => { sendPasswordResEmail(e) }} className="flex flex-col items-center justify-center h-[90vh] px-2 pt-10 md:pt-0 bg-[#5300db]">
            <div className="flex items-center flex-col gap-8 w-full max-w-md rounded-xl p-8 border border-slate-500/60 backdrop-blur-lg  bg-white" >
                <p>We will send a password reset link to your registered email</p>
                <div className="relative bg-inherit w-full">
                    <input type="email" id="email" placeholder="Enter Your Registered Email" onChange={(e) => { setEmail(e.target.value) }} className="peer bg-transparent h-10 rounded-lg text-gray-600 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-gray-600 focus:outline-none focus:border-rose-600 w-full" />
                    <label htmlFor="email" className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-slate peer-focus:text-sm transition-all">
                    Enter Your Registered Email
                    </label>
                </div>

                <button type="submit" className="py-3 rounded-lg bg-gradient-to-r font-semibold bg-[#5D01F6] hover:bg-[#5D01F6] w-full text-white flex justify-center items-center">
                    {
                        loading ?
                            <div className="flex justify-center items-center gap-2">
                                <Spinner className="h-5 w-5" />
                                <p>Sending </p>
                            </div>
                            : "Email Me"
                    }
                </button>
            </div>
        </form>

    )
}

export default ForgotPassword;


