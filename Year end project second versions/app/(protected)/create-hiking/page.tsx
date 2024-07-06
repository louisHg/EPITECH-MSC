import { db } from "@/lib/db";
import CreateHikingForm from "./components/create-hiking-form";
import Footer from "@/components/ui/footer";

export type CreatePageProps = {};

const CreatePage: React.FC<CreatePageProps> = async () => {
  const difficulties = await db.difficulty.findMany();

  return (
    <>
      <div className="flex flex-1 flex-col container  w-full h-full py-16">
        <h1 className="text-2xl font-bold">Create a custom trip</h1>
        <CreateHikingForm difficulties={difficulties} />
      </div>
      <Footer />
    </>
  );
};

export default CreatePage;
