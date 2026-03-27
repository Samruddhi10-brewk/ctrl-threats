import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase";
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
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Error logging in");
    }
    throw error;
  }
};

function OAuth() {
  const router = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async () => {
    
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const idToken = await user.getIdToken();
      

      const data = await OAuthAPI(idToken);
      


      setEmail(data.email);
      setUsername(data.username);

      dispatch(
        loginSuccess({
          email: user.email,
          name: user.displayName,
          accessToken: data.access, // ✅ FIXED
        })
      );
      
      toast.success("Google Login Successful");
      router("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Login failed");
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