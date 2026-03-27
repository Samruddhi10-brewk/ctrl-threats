import * as Yup from "yup";
export const registerSchema = Yup.object().shape(
    {
        username: Yup.string().required("User name required"),
        email: Yup.string().email().required("Email Required"),
        password: Yup.string()
            .required('No password provided.')
            .min(8, 'Password should be 8 chars minimum.')
            .matches(/[0-9]/, 'Password requires a number')
            .matches(/[a-z]/, 'Password requires a lowercase letter')
            .matches(/[A-Z]/, 'Password requires an uppercase letter')
            .matches(/[^\w]/, 'Password requires a symbol'),
        confirm_password: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
    }
)

