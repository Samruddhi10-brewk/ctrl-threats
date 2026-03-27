export const AUTH_APIS = {
    LOGIN: "/login/",
    REGISTER: "/signup/",
    RESETPASSWORD: "/reset-password/",
    REFRESH_TOKEN: "/token/refresh/",
    PROFILE: "/profile/",
    UPDATE_PROFILE: "/updateuserprofile/",
    HISTORY: "/history/"
} as const

export const BLOG_API = {
    GET_BLOG_CARDS: "blogs/summary/",
    GET_BLOG_DETAILS: (id: string) => `blogs/${id}/`
}


export const CONTACT_API = {
    STORE_CONTACT: "contact/"
}


