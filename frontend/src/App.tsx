import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './layout'
import Results from './results'
import HomePage from './components/landing/App/Home'
import AboutUs from './components/landing/App/about/AboutUs.tsx'
import LoginForm from './components/auth/login/loginform'
import ContactUs from './components/landing/App/contact/contactus'
import Webtool from './components/landing/webtool'
import Register from './components/auth/register/Register'
import PhishingMail from './components/landing/App/PhishingMail'
import ForgotPasword from './components/auth/resetPasword/ForgotPasword.tsx'
import ProfileDetails from './components/shared/ProfileDetails.tsx'
import PrivacyPolicy from './components/shared/PrivacyPolicy.tsx'
import TermsOfUse from './components/shared/TermsOfUse.tsx'

function App() {
    return (
        <>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route element={<HomePage />} path="/" />
                        <Route element={<AboutUs />} path="/about" />
                        <Route element={<Results />} path="/result/:domain" ></Route>
                        <Route element={<LoginForm />} path="/login" />
                        <Route element={<ContactUs />} path="/contact" />
                        <Route element={<Webtool />} path="/webscan" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<PhishingMail />} path="/emaildetection"></Route>
                        <Route element={<ProfileDetails />} path="/profile"></Route>
                        <Route element={<ForgotPasword />} path="/forgotpassword"></Route>
                        <Route element={<PrivacyPolicy />} path="/privacy-policy"></Route>
                        <Route element={<TermsOfUse />} path="/terms-of-use"></Route>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </>
    )
}

export default App

// test