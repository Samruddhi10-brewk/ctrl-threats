import Features1 from "./features1";
import WebscanFeatures from "./webscanfeatures";
import BlogSection from "./blogs";
import Home1 from "./home";
import LearnMore from "./learnmore";
import Phishinglearn from "../phishinglearn";
export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Home1 />
            <Features1 />
            <LearnMore />
            <Phishinglearn />
            <WebscanFeatures />
            <BlogSection />
        </div>
    );
}
