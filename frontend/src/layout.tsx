import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import MainHeader from './components/shared/MainHead';
import SEO from './components/shared/SEO';

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <SEO />
            <MainHeader />
            <Header />
            <div className="">
                {children}
            </div>
            <Footer />
        </>
    )
}


export default Layout;
