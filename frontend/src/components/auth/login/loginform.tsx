import { FaApple } from "react-icons/fa6";
import microsoftLogo from "/logos_microsoft-icon.png";
import { useState } from "react";
import { useAppDispatch } from "../../../store";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { loginUser } from "../../../api/auth";
import { loginSuccess } from "../../../store/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../../../constants/validations/loginSchema";
import { IoEyeOff } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { Spinner } from "flowbite-react";
import OAuth from "../OAuth";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [revealPass, setRevealPass] = useState(false);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const toggleRevealPass = () => setRevealPass((prev) => !prev);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const auth = getAuth(app);
    const { email, password } = values;

    try {
      // 🔥 Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔥 Get Firebase token
      const idToken = await user.getIdToken();

      // 🔥 Send token to backend
      const data = await loginUser({ credentials: idToken });

      dispatch(loginSuccess(data));
      toast.success("Login Successful");

      // 🔁 Redirect logic
      const redirectUrl = localStorage.getItem("redirectUrl");
      if (redirectUrl) {
        nav(redirectUrl);
        localStorage.removeItem("redirectUrl");
      } else {
        nav("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // 🔥 Firebase Errors
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            toast.error("Invalid email address");
            break;
          case "auth/user-disabled":
            toast.error("Account disabled");
            break;
          case "auth/user-not-found":
            toast.error("User not found");
            break;
          case "auth/wrong-password":
            toast.error("Incorrect password");
            break;
          case "auth/too-many-requests":
            toast.error("Too many attempts. Try later");
            break;
          default:
            toast.error(error.message);
        }
      }
      // 🔥 Backend Errors
      else if (error.response?.data) {
        const { message } = error.response.data;
        toast.error(message || "Something went wrong");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 py-10 bg-[linear-gradient(-270deg,_#4D00CD_25%,_#5D05EC_1000%)]">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={loginSchema}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5 w-full max-w-[30rem] rounded-xl p-8 border border-slate-500/60 bg-white">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/Layer 1.png" alt="Logo" />
            </div>

            {/* Register */}
            <p className="text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#5D01F6] hover:underline font-semibold"
              >
                Register
              </Link>
            </p>

            {/* Email */}
            <div className="relative">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="h-10 w-full rounded-lg ring-2 px-2"
              />
              <ErrorMessage
                name="email"
                component="span"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={toggleRevealPass}
              >
                {revealPass ? <IoEyeOff /> : <MdRemoveRedEye />}
              </span>

              <Field
                type={revealPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="h-10 w-full rounded-lg ring-2 px-2"
              />
              <ErrorMessage
                name="password"
                component="span"
                className="text-red-500 text-xs"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 rounded-full bg-[#5D01F6] text-white flex justify-center"
            >
              {isSubmitting ? <Spinner className="h-5 w-5" /> : "Login"}
            </button>

            {/* Forgot Password */}
            <Link
              to="/forgotpassword"
              className="text-center text-[#5D00F3] hover:underline"
            >
              Forgot Password?
            </Link>

            {/* OAuth */}
            <div className="text-center mt-4">
              <p className="text-gray-500">- OR -</p>

              <div className="flex justify-center gap-4 mt-4 items-center">
                <OAuth /> {/* ✅ Google handled here */}

                <FaApple size={28} className="cursor-pointer" />

                <img
                  src={microsoftLogo}
                  alt="Microsoft"
                  className="h-6 w-6 cursor-pointer"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;