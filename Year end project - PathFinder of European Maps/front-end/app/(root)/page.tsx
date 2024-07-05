import Navbar from "@/components/ui/navbar";
import SearchField from "./components/search-field";
import InfosText from "./components/infos-text";
import WorkerSection from "./components/worker-section";
import WorkerText from "./components/worker-text";
import FeatureSection from "./components/feature-section";
import Footer from "@/components/ui/footer";
import ContactSection from "./components/contact-section";

const LandingPage: React.FC = () => {
  return (
    <>
      <main className="h-auto dark:bg-black flex flex-col items-center ">
        <div
          className="w-full h-[50vh] bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/LandingPage/bg.png")',
            backgroundAttachment: "fixed",
          }}
        >
          <Navbar />
        </div>
        <SearchField />
        <InfosText />
        <FeatureSection />
        <WorkerText />
        <WorkerSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
};

export default LandingPage;
