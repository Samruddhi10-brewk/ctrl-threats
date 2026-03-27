import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { Avatar, Dropdown } from "flowbite-react";
import { RootState, useAppDispatch, useAppSelector } from "../../store";
import { logoutUser } from "../../store/features/auth/authSlice";
import { accentColor } from "../../constants/constants";
import { clearLocalStorage } from "../../utils/LocalStorage";
import toast from "react-hot-toast";



export default function Header() {
    const [sideBar, setSideBar] = useState(false);
    const currentUser = useAppSelector((store: RootState) => store.currentUser);
    const dispatch = useAppDispatch();
    const router = useNavigate();

    async function handleLogout() {
        try {
            clearLocalStorage();
            dispatch(logoutUser());
            router('/');
            toast.success("LogOut Successful");
        } catch (e) {
            toast.error("LogOut Successful");
        }
    }


    return (
        <div className={`w-full z-50 transition-all duration-300 ease-in-out pt-2 `}>
            <section className="flex justify-between items-center w-full px-10 py-1 text-lg">
                <Link to="/" className="flex flex-row items-center sm:gap-1 gap-1 text-xs sm:text-base">
                    <img src="/Group 2638.png" alt="Ctrl threat" className="h-[5rem] w-[15rem] lg:h-[4rem] object-contain lg:w-[25rem]" />
                </Link>

                <p className="hidden lg:flex flex-row gap-6 transition-all ease-in-out items-center">
                    <Link className="group duration-300 text-gray-700 transition ease-in-out hover:text-gray-800 active:text-gray-900" to="/about">ABOUT US
                        <span className={`block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 ${accentColor}`}></span>
                    </Link>
                    <Dropdown
                        label={
                            <span className="flex items-center gap-1 text-lg font-medium text-gray-700 ml-4 pl-2">
                                TOOLS
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 22 22" aria-hidden="true" className="ml-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                            </span>
                        }
                    >
                        <Dropdown.Item onClick={() => setSideBar(false)} as={Link} to="/webscan" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300">
                            WEB SCAN
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSideBar(false)} as={Link} to="/emaildetection" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300">
                            PHISHING EMAIL
                        </Dropdown.Item>
                    </Dropdown>
                    <Link className="group duration-300 text-gray-700 transition ease-in-out hover:text-gray-800 active:text-gray-900 mr-8" to="/contact">CONTACT US
                        <span className={`block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 ${accentColor}`}></span>
                    </Link>
                    {currentUser ?
                        <Dropdown
                            label={
                                <Avatar />
                            }
                            arrowIcon={false}
                            inline
                            className="bg-white text-black border border-slate-800 pt-1"
                        >
                            <Dropdown.Item as={Link} to="/profile">
                                Profile
                            </Dropdown.Item> <Dropdown.Item onClick={() => { dispatch(logoutUser()); handleLogout() }} >
                                Log Out
                            </Dropdown.Item>
                        </Dropdown>
                        :
                        <Link className="group duration-300 text-gray-700 transition ease-in-out pt-1 hover:text-gray-800 active:text-gray-900" to="/login">LOGIN
                            <span className={`block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 ${accentColor}`}></span>
                        </Link>
                    }


                </p>
                <button
                    onClick={() => setSideBar(!sideBar)}
                    className="lg:hidden text-2xl flex items-center text-black"
                >
                    <FiMenu className="text-3xl" />
                </button>
            </section>

            <nav
                className={`bg-white bg-center min-h-screen fixed inset-0 z-[9999999] transition-transform transform w-screen duration-200 ${sideBar ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
            >
                <div className="flex justify-between items-center p-5 text-white text-xl">
                    <img src="/Group 2638.png" alt="Ctrl threat" width={300} height={100} className="h-[3rem] w-[15rem] lg:h-[4rem] object-contain lg:w-[20rem]" />
                    <button
                        onClick={() => setSideBar(!sideBar)}
                        className="text-xl"
                    >
                        <AiOutlineClose className="text-black" />
                    </button>
                </div>
                <div className="flex flex-col items-center gap-10 mt-[8.0rem] text-lg">
                    <Link onClick={() => setSideBar(false)} to="/" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300">HOME</Link>
                    <Link onClick={() => setSideBar(false)} to="/about" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300">ABOUT US</Link>
                    <Link onClick={() => setSideBar(false)} to="/contact" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300">CONTACT US</Link>
                    <span className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300 text-lg">
                        <Dropdown
                            label={
                                <span className="flex items-center gap-0 text-lg font-medium text-black">
                                    TOOLS
                                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                                </span>
                            }
                        >
                            <Dropdown.Item onClick={() => setSideBar(false)} as={Link} to="/webscan" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300">
                                WEB SCAN
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSideBar(false)} as={Link} to="/emaildetection" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300">
                                PHISHING EMAIL
                            </Dropdown.Item>
                        </Dropdown>

                    </span>

                    {
                        currentUser ? (
                            <Link to="/login" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500" onClick={() => {
                                setSideBar(false);
                                dispatch(logoutUser());
                                handleLogout();
                            }}>LOG OUT</Link>
                        ) :
                            <Link to="/login" className="cursor-pointer hover:text-slate-300 transition ease-in-out active:text-slate-500 group duration-300" onClick={() => setSideBar(false)}
                            >LOGIN
                                <span className={`block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 ${accentColor}`}></span>
                            </Link>
                    }

                </div>
            </nav>
        </div>
    );
}