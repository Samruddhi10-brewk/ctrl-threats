import About from "./index";
import CollaborationSection from "../../collaboration";
import EnterpriseSection from "../../enterprise";
import CyberThreatCases from "../../realcases";

export default function AboutUs() {
    return (
        <div>
            <About />
            <div className="max-w-7xl mx-auto w-full">
                <EnterpriseSection />
                <CyberThreatCases />
                <CollaborationSection />
            </div>

        </div>
    );
}
