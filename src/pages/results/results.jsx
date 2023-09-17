import RootContext from "../../providers/root";
import { SpeciesCard, FileButton, ResultsTable } from "../../components";
import { useContext, useState } from "react";
import main_logo from "../../assets/branding/main_logo.svg";
import home_icon from "../../assets/ui-elements/orange_home.svg";
import orange_download_icon from "../../assets/ui-elements/orange_download-icon.svg";
import gray_download_icon from "../../assets/ui-elements/gray_download-icon.svg";
import "tailwindcss/tailwind.css";
import "./results.css";

const ResultsPage = () => {
  const { data, setCurrentPage } = useContext(RootContext);

  const [currentSelectedImage, setCurrentSelectedImage] = useState(null);

  console.log(data);
  return (
    // Main Parent
    <main className="flex min-h-screen px-8 pt-8 gap-11">
      {/* File Navigation Section */}
      <div className="flex flex-col w-1/3 shadow-3xl panel rounded-t-3xl">
        {/* Navigation Header */}
        <div className="flex flex-col relative h-[calc(100%-1100px)]">
          {/* row for the home button so that it doesn't overlap with the logo */}
          <div className="w-full h-16">
            {/* Home Button */}
            <div className="top-0 flex items-center justify-center w-8 m-4 cursor-pointer align-items left-1 aspect-square back">
              {/* Return to home button */}
              <button type="button" onClick={() => setCurrentPage("")}>
                <img
                  src={home_icon}
                  className="items-center w-full h-full return-button style_home"
                ></img>
              </button>
            </div>
          </div>

          {/* row for the logo */}
          <div className="flex items-center justify-center w-full h-full ">
            {/* Ocell.ai Logo */}
            <div className="flex mt-6 mb-4" style={{ height: 100, width: 300 }}>
              <img src={main_logo} className="top-0 w-full h-full"></img>
            </div>
          </div>
        </div>

        {/* Navigation Body */}
        <div className="relative justify-center h-full overflow-y-auto">
          <div className="flex flex-col items-center w-full h-full gap-4 p-5 mt-4 mb-4 overflow-y-auto">
            {data.predictions.map((image) => (
              <FileButton
                image={image}
                selected={
                  currentSelectedImage?.input_image_path ==
                  image.input_image_path
                }
                key={image.input_image_path}
                onClick={() => setCurrentSelectedImage(image)}
              />
            ))}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="h-20 border border-black">
          <div className="flex items-center justify-center mt-4">
            <a
              className="flex items-center gap-2 cursor-pointer"
              // onClick={handleExpand}
            >
              <div className="w-8 rounded aspect-square">
                <img
                  src={orange_download_icon}
                  className="items-center w-full h-full return-button style_home"
                ></img>
              </div>
              <span className="text-xl">DOWNLOAD BATCH RESULT</span>
            </a>
          </div>
        </div>
      </div>

      {/* ============== Results Section ================== */}
      <div className="flex flex-col w-2/3 pb-8">
        {/* Species Card Section */}
        <div className="relative flex pb-6 border-b border-black h-3/5 gap-9">
          <SpeciesCardGroup image={currentSelectedImage} />
        </div>

        {/* Auxiliary Info Section */}
        <div className="flex h-2/5">
          {/* Reference Image Section */}
          <div className="flex flex-col justify-center w-4/12 border-r border-black">
            {/* HEADER */}
            <div className="flex items-center justify-center h-16 border border-black ">
              <span className="text-2xl">INPUT IMAGE</span>
            </div>

            {/* IMAGE FILE */}
            <div className="flex items-center justify-center h-full border border-black">
              <div className="flex rounded-2xl w-96 h-96 aspect-square bg-slate-500"></div>
            </div>

            {/* INDIVIDUAL DOWNLOAD */}
            <div className="h-16 border border-black">
              <div className="flex items-center justify-center">
                <a
                  className="flex items-center gap-2 mt-2 cursor-pointer"
                  // onClick={handleExpand}
                >
                  <div className="w-8 rounded aspect-square">
                    <img
                      src={gray_download_icon}
                      className="items-center w-full h-full return-button style_home"
                    ></img>
                  </div>
                  <span className="text-xl">DOWNLOAD BATCH RESULT</span>
                </a>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="w-8/12">
            <div className="flex flex-col justify-center border border-black">
              {/* HEADER */}
              <div className="flex items-center h-16 ml-4 border border-black justify-left">
                <span className="text-xl">FULL PREDICTION SET PREVIEW</span>
              </div>
              {/* TABLE */}
              <div className="flex items-center justify-center w-full h-full p-6 border border-black">
                <ResultsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

function SpeciesCardGroup({ image }) {
  if (!image) return null;

  const { predictions } = image;
  console.log(predictions);

  return (
    <>
      {Object.entries(predictions).map(([rank, prediction]) => (
        <SpeciesCard key={rank} rank={rank} {...prediction} />
      ))}

      {/* <SpeciesCard
        rank={0}
        confidence={0.79}
        species_name={"species A"}
        tags={{
          endemic: false,
          invasive: true,
          "non-native": true,
          "non-invasive": false,
        }}
      />
       */}
    </>
  );
}

export default ResultsPage;
