import { contactType } from "../components/landing/App/contact/contactus";
import axios from "./axios";
import {AxiosError} from "axios";
import {CONTACT_API} from "./api";

export const saveContact = async (contactData: contactType) => {
    const {comments, companyname, country, email, firstname, industry, lastname, phonenumber} = contactData;
    try {
        const response = await axios.post(CONTACT_API.STORE_CONTACT, {
            first_name: firstname,
            last_name: lastname,
            company_name: companyname,
            email,
            industry: industry,
            phone_number: phonenumber,
            comments,
            country
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message);
        } else {
            throw new Error(`${error}`);
        }
    }
};


