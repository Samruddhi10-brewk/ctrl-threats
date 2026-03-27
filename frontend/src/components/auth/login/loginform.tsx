import { FaApple } from "react-icons/fa6";
import microsoftLogo from "/logos_microsoft-icon.png";
import { useState } from "react";
import { useAppDispatch } from "../../../store";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { loginUser } from "../../../api/auth";
import { loginSuccess } from "../../../store/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../../../constants/validations/loginSchema";
import { IoEyeOff } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { Spinner } from "flowbite-react";
import OAuth from "../OAuth";

type LoginFormValues = { email: string; password: string };

const LoginForm = () => {
  const [revealPass, setRevealPass] = useState(false);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const toggleRevealPass = () => setRevealPass((prev) => !prev);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    
    const { email, password } = values;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const data = await loginUser({ credentials: idToken });

      dispatch(loginSuccess(data));
      toast.success("Login Successful");

      const redirectUrl = localStorage.getItem("redirectUrl");
      if (redirectUrl) {
        nav(redirectUrl);
        localStorage.removeItem("redirectUrl");
      } else {
        nav("/");
      }
    } catch (error: any) {
      // Firebase Auth Errors
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            toast.error("Invalid email address");
            break;
          case 'auth/user-disabled':
            toast.error("This account has been disabled");
            break;
          case 'auth/user-not-found':
            toast.error("No account exists with this email");
            break;
          case 'auth/wrong-password':
            toast.error("Incorrect password");
            break;
          case 'auth/too-many-requests':
            toast.error("Too many failed attempts. Please try again later");
            break;
          default:
            toast.error("Login failed: " + error.message);
        }
      }
      // Backend API Errors
      else if (error.response?.data) {
        const { message, code } = error.response.data;
        switch (code) {
          case 'token_expired':
            toast.error("Session expired. Please try again");
            break;
          case 'invalid_token':
            toast.error("Authentication failed. Please try again");
            break;
          case 'token_revoked':
            toast.error("Session revoked. Please login again");
            break;
          case 'server_error':
            toast.error("Server error. Please try again later");
            break;
          default:
            toast.error(message || "Something went wrong");
        }
      } else {
        toast.error("Login failed. Please try again");
      }
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 md:pt-0 py-10 bg-[linear-gradient(-270deg,_#4D00CD_25%,_#5D05EC_1000%)]">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={loginSchema}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5 w-full max-w-[30rem] rounded-xl p-8 border border-slate-500/60 bg-white">
            <div className="bg-white py-5 mb-14">
              <div className="flex justify-center mb-10">
                <img src="/Layer 1.png" alt="Logo" />
              </div>
              <p className="text-center text-base text-gray-600">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#5D01F6] hover:underline font-semibold"
                >
                  Register
                </Link>
              </p>
              <div className="mt-8 border-t flex flex-col gap-2">
                {/* Email Field */}
                <div className="bg-inherit relative">
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-gray-600 focus:outline-none w-full"
                  />
                  <label
                    htmlFor="email"
                    className="absolute cursor-text left-0 -top-3 text-sm bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-white peer-focus:text-sm transition-all !text-black !bg-white"
                  >
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

                {/* Password Field */}
                <div className="relative bg-inherit">
                  <span
                    className="absolute right-2.5 top-[9px] z-12 "
                    onClick={toggleRevealPass}
                  >
                    {revealPass ? (
                      <IoEyeOff className="text-black text-2xl" />
                    ) : (
                      <MdRemoveRedEye className="text-black text-2xl" />
                    )}
                  </span>
                  <Field
                    type={revealPass ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    id="password"
                    className="peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-gray-600 focus:outline-none w-full"
                  />
                  <label
                    htmlFor="password"
                    className="absolute cursor-text left-0 -top-3 text-sm text-black bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-white peer-focus:text-sm transition-all !text-black !bg-white"
                  >
                    Password
                  </label>
                  <div className="min-h-[1.5rem]">
                    <ErrorMessage
                      name="password"
                      component="span"
                      className="text-red-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 rounded-full bg-[#5D01F6] font-semibold w-full text-white flex justify-center items-center hover:shadow-lg transition ease-in-out"
              >
                {isSubmitting ? (
                  <div className="flex justify-center items-center gap-2">
                    <Spinner className="h-5 w-5" />
                    <p>Loading</p>
                  </div>
                ) : (
                  "Login"
                )}
              </button>

              {/* Forgot Password */}
              <Link
                to="/forgotpassword"
                className="text-lg text-[#5D00F3] hover:underline block mt-6 text-center"
              >
                Forgot Password?
              </Link>

              {/* OAuth Options */}
              <div className="mt-6 border-t pt-5 text-center">
                <p className="text-lg text-gray-500">- OR -</p>
                <div className="flex justify-center space-x-3 mt-6">
                  <button className="text-gray-600 flex items-center">
                    <OAuth />
                  </button>
                  <button className="text-gray-600 flex items-center">
                    <FaApple className="mr-4" size={30} />
                  </button>
                  <button className="text-gray-600 flex items-center">
                    <img
                      src={microsoftLogo}
                      alt="Microsoft Logo"
                      className="h-6 w-6 mr-6"
                    />
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;