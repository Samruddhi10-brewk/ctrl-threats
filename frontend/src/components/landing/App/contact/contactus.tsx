import {Formik, Form, Field, ErrorMessage} from "formik";
import {accentColor, accentGradientColor, contactSchema, country_list} from "../../../../constants/constants";
import {saveContact} from "../../../../services/contact";
import toast from "react-hot-toast";
import {Spinner} from "flowbite-react";

export type contactType = {
    first_name: string;
    last_name: string;
    email: string;
    company_name: string;
    phone_number: string;
    industry: string;
    country: typeof country_list | "";
    comments: string;
}


export default function Contact() {
    const formData: contactType = {
        first_name: "",
        last_name: "",
        email: "",
        company_name: "",
        phone_number: "",
        industry: "",
        country: "",
        comments: ""
    };

    async function handleSubmit(values: contactType) {
        // if (!hasToken()) {
        //     setOpenModal(true);
        //     return;
        // }
        try {
            await saveContact(values);
            toast.success("Message Sent Successfully");
        } catch (e: unknown) {
            toast.error("Couldn't send the message, try again");
        } finally {
        }
    }

    return (
        <main className="flex flex-col justify-center">
            <div className={`w-full ${accentGradientColor} bg-inherit p-10 items-center justify-around min-h-[80vh] flex flex-col lg:flex-row`}>
                <div className="flex flex-col justify-center p-6 text-white w-3/2 bg-inherit">
                    <h1 className="text-6xl font-bold">CONTACT US</h1>
                    <p className="mt-6 text-m">AI-Driven Protection for a Safer Digital Future — Let’s Connect</p>
                </div>

                <Formik
                    initialValues={formData}
                    onSubmit={handleSubmit}
                    validationSchema={contactSchema}

                >
                    {({isSubmitting, handleBlur}) => (
                        <Form className="flex flex-col gap-5 p-5 px-4 bg-white rounded-md" id="contactForm">
                            <p className="flex flex-row gap-1 text-2xl font-semibold">
                                <span>Get in</span>
                                <p className="text-[#5C05EB]">Touch</p>
                            </p>
                            <div className="flex flex-col justify-center flex-1">
                                <Field
                                    placeholder="First Name"
                                    name="first_name"
                                    type="text"
                                    className="flex-1 py-2 pl-3 rounded-md bg-transparent border-[1px] border-black"
                                />
                                <div className="min-h-[1.5rem]">
                                    <ErrorMessage
                                        name="first_name"
                                        component="span"
                                        className="text-xs text-red-500"
                                    />
                                </div>

                                <Field
                                    placeholder="Last Name"
                                    name="last_name"
                                    type="text"
                                    onBlur={handleBlur}
                                    className="flex-1 py-2 pl-3 rounded-md bg-transparent border-[1px] border-black"
                                />
                                <div className="min-h-[1.5rem]">
                                    <ErrorMessage
                                        name="last_name"
                                        component="span"
                                        className="text-xs text-red-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center flex-1">
                                <Field
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    className="flex-1 py-2 pl-3 rounded-md bg-transparent border-[1px] border-black"
                                    onBlur={handleBlur}
                                />
                                <div className="min-h-[1.5rem]">
                                    <ErrorMessage
                                        name="email"
                                        component="span"
                                        className="text-xs text-red-500"
                                    />
                                </div>
                                <Field
                                    placeholder="Phone Number"
                                    name="phone_number"
                                    className="flex-1 py-2 pl-3 rounded-md bg-transparent border-[1px] border-black"
                                    type="text"
                                    onBlur={handleBlur}
                                />
                                <div className="min-h-[1.5rem]">
                                    <ErrorMessage
                                        name="phone_number"
                                        component="span"
                                        className="text-xs text-red-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-5 sm:flex-row">
                                <div className="flex flex-col justify-center flex-1">
                                    <Field
                                        placeholder="Company Name"
                                        name="company_name"
                                        className="flex-1 py-2 pl-3 rounded-md bg-transparent border-[1px] border-black"
                                        type="text"
                                        onBlur={handleBlur}
                                    />
                                    <div className="min-h-[1.5rem]">
                                        <ErrorMessage
                                            name="company_name"
                                            component="span"
                                            className="text-xs text-red-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center flex-1">
                                    <Field
                                        placeholder="Industry"
                                        name="industry"
                                        className="flex-1 py-2 pl-3 rounded-md bg-transparent border-[1px] border-black"
                                        type="text"
                                        onBlur={handleBlur}
                                    />
                                    <div className="min-h-[1.5rem]">
                                        <ErrorMessage
                                            name="industry"
                                            component="span"
                                            className="text-xs text-red-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center flex-1">
                                    <Field
                                        autoComplete="off"
                                        name="country" type="text" list="country" className="flex-1 py-2 lg:py-3 pl-3 rounded-md bg-transparent border-[1px] border-black" placeholder="Country" />
                                    <div className="min-h-[1.5rem]">
                                        <ErrorMessage
                                            name="country"
                                            component="span"
                                            className="text-xs text-red-500"
                                        />
                                    </div>
                                </div>

                                <datalist
                                    className="w-full"
                                    id="country"
                                >
                                    <option disabled>Country</option>
                                    {
                                        country_list.map((country, index) => (

                                            <option key={index} value={country}>{country}</option>
                                        ))}

                                </datalist>
                            </div>

                            <div className="flex flex-col justify-center flex-1">
                                <Field
                                    as="textarea"
                                    cols={10}
                                    rows={3}
                                    placeholder="Comments"
                                    name="comments"
                                    className="flex-1 py-2 pl-3 rounded-md bg-transparent border-[1px] border-black"
                                    onBlur={handleBlur} />
                                <div className="min-h-[1.5rem]">
                                    <ErrorMessage
                                        name="comments"
                                        component="span"
                                        className="text-xs text-red-500"
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`py-2 font-semibold w-2/3 mx-auto ${accentColor} text-white rounded-full`}>
                                {isSubmitting ?
                                    <div className="flex items-center justify-center gap-2">
                                        <Spinner className="w-5 h-5" />
                                        <p>Sending</p>
                                    </div>
                                    : "Submit"}
                            </button>
                        </Form>
                    )
                    }
                </Formik >

            </div >
            


        </main>


    );
};
