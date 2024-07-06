import SearchField from "./components/search-field";
import InfosText from "./components/infos-text";
import WorkerSection from "./components/worker-section";
import WorkerText from "./components/worker-text";
import FeatureSection from "./components/feature-section";
import Footer from "@/components/ui/footer";
import ContactSection from "./components/contact-section";
import SuggestionSection from "./components/suggestion-section";
import Navbar from "@/components/ui/navbar";
import { useSession } from "next-auth/react";
import { auth } from "@/auth";
import LoggedNavbar from "@/components/ui/logged-navbar";

const LandingPage: React.FC = async () => {
  const session = await auth();

  return (
    <>
      <div
        className="w-full h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/LandingPage/bg.png")',
          backgroundAttachment: "fixed",
        }}
      ></div>

      <SearchField />
      <SuggestionSection />
      <InfosText />
      <FeatureSection />
      <WorkerText />
      <WorkerSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default LandingPage;
