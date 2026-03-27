import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../../firebase";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import {
  setAccessToken,
  setEmail,
  setRefreshToken,
  setUsername,
} from "../../utils/LocalStorage";
import axios from "../../services/axios";
import { AUTH_APIS } from "../../api/apis";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { loginSuccess } from "../../store/features/auth/authSlice";

const OAuthAPI = async (credentials: string) => {
  try {
    const response = await axios.post(`${AUTH_APIS.LOGIN}`, {
      firebase_token: credentials,
      isOAuth: true,
    });

    setRefreshToken(response.data.refresh);
    setAccessToken(response.data.access);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Something went wrong");
  }
};

function OAuth() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  const router = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      // 🔥 Firebase popup login
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // 🔥 Get Firebase token
      const idToken = await user.getIdToken();

      // 🔥 Send token to backend
      const data = await OAuthAPI(idToken);

      // 🔥 Store user info
      setEmail(data.email);
      setUsername(data.username);

      dispatch(
        loginSuccess({
          email: user.email,
          name: user.displayName,
          accessToken: idToken,
        })
      );

      toast.success("Google Login Successful");
      router("/");
    } catch (error: any) {
      console.error("Google Login Error:", error);

      // 🔥 Firebase specific errors
      if (error.code) {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            toast.error("Login cancelled");
            break;
          case "auth/network-request-failed":
            toast.error("Network error");
            break;
          case "auth/unauthorized-domain":
            toast.error("Domain not authorized");
            break;
          default:
            toast.error(error.message);
        }
      } else {
        toast.error(error.message || "Google login failed");
      }
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="flex hover:scale-105 transition items-center gap-3 bg-white rounded-lg py-3 px-3 text-black justify-center w-full md:w-auto"
    >
      <FcGoogle className="text-3xl" />
    </button>
  );
}

export default OAuth;