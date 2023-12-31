import RootContext from "../../providers/root";
import { SpeciesCard, FileButton, ResultsTable } from "../../components";
import React, { useContext, useEffect, useState } from "react";
import main_logo from "../../assets/branding/main_logo.svg";
import insect_logo from "../../assets/branding/insect_logo.svg";
import home_icon from "../../assets/ui-elements/orange_home.svg";
import orange_download_icon from "../../assets/ui-elements/orange_download-icon.svg";
import gray_download_icon from "../../assets/ui-elements/gray_download-icon.svg";
import "tailwindcss/tailwind.css";
import "./results.css";
import axios from "axios";

const ResultsPage = () => {
  const { data, setCurrentPage } = useContext(RootContext);

  const [currentSelectedImage, setCurrentSelectedImage] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (data?.predictions && data.predictions.length) {
      setCurrentSelectedImage(data.predictions[0]);
    }
  }, [data]);

  const downloadFile = async () => {
    try {
      // Send a GET request to the '/download' endpoint on the flask backend server hosted on 'http://localhost:5000' retrieve the batched csv fle.
      const response = await axios.get(`http://localhost:5000/download`, {
        responseType: "blob",
      });

      // Create a Blob object from the response data
      const fileBlob = new Blob([response.data]);

      // Create a URL for the Blob
      const fileURL = window.URL.createObjectURL(fileBlob);

      // Create a temporary download link from fileURL
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = "predictions.csv";

      // Activate the link to download the file.
      downloadLink.click();
    } catch (error) {
      // Display errors/status if there is an error
      console.error("Error downloading file:", error);
    }
  };

  const downloadIndividualFile = async (filename) => {

    // Get the filename of the selected image.
    const imagename = filename.replace(/\.[^/.]+$/, "");

    try {
      // Send a GET request to the '/download_individual_result' endpoint on the flask backend server hosted on 'http://localhost:5000' retrieve the individual csv fle.
      const response = await axios.get(
        `http://localhost:5000/download_individual_result/${filename}`,
        {
          responseType: "blob",
        }
      );

      // Create a Blob object from the response data
      const fileBlob = new Blob([response.data]);

      // Create a URL for the Blob
      const fileURL = window.URL.createObjectURL(fileBlob);

      // Create a temporary download link from fileURL
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = `${imagename}_predictions.csv`;

      // Activate the link to download the file.
      downloadLink.click();
    } catch (error) {
      // Display errors/status if there is an error
      console.error("Error downloading file:", error);
    }
  };

  // Handler for opening the 'return to home page' popup.
  const openPopup = () => {
    setShowPopup(true);
  };

  // Handler for closing the 'return to home page' popup.
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    // Main Parent
    <main className="flex max-h-screen min-h-screen px-8 pt-8 overflow-hidden transition max-w-screen gap-11">
      {/* File Navigation Section */}
      <div className="flex flex-col responsive-width-sidebar shadow-3xl rounded-t-3xl max-h-fit panel">
        {/* Navigation Header */}
        <div className="relative flex flex-col h-1/6">
          {/* row for the home button so that it doesn't overlap with the logo */}
          <div className="flex w-full h-16">
            {/* Logo which appears when browser size decreases */}
            <div className="responsive-visible responsive-logo">
              <img
                src={insect_logo}
                className="company_logo"
                alt="Ocell.ai Logo"
              ></img>
            </div>

            {/* Home Button */}
            <div className="w-8 m-5 cursor-pointer responsive_home_icon">
              {/* Return to home button */}
              <button type="button" onClick={openPopup}>
                <img
                  src={home_icon}
                  className="items-center w-full h-full return-button style_home"
                  alt="home icon"
                ></img>
              </button>
            </div>
          </div>

          {/* row for the logo */}
          <div className="flex items-center justify-center w-full h-2/3">
            {/* Ocell.ai Logo */}
            <div className="flex w-1/2 mt-6 mb-6 h-2/3 responsive-hide">
              <img
                src={main_logo}
                className="company_logo"
                alt="Ocell.ai Logo"
              ></img>
            </div>
          </div>
        </div>

        {/* Navigation Body */}
        <div className="relative flex flex-col items-start gap-4 pt-4 pb-2 h-5/6 max-h-fit overflow-clip">
          <div className="items-start w-full p-8 overflow-y-auto h-[calc(100%-80px)]">
            {/* Contains a list of all the images pushed into the model. Allows the user to click on one to the see the predicitons for that specific image. */}
            <div className="flex flex-col w-full h-full gap-4 responsive-hide">
              {data.predictions.map((image) => (
                <FileButton
                  image={image}
                  selected={
                    currentSelectedImage?.input_image_filename ===
                    image.input_image_filename
                  }
                  key={image.input_image_filename}
                  onClick={() => setCurrentSelectedImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Batch Download Button */}
          <div
            className="flex items-center justify-center w-full h-20% absolute bottom-8"
            z
          >
            <button
              className="flex items-center justify-center p-3 rounded-lg hover-btn"
              onClick={() => downloadFile()}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-6 rounded aspect-square">
                  <img
                    src={orange_download_icon}
                    className="items-center w-full h-full return-button style_home button_text"
                    alt="Orange download icon"
                  ></img>
                </div>
                <span
                  className="text-xl text-status-orange hover-span responsive-hide"
                  style={{
                    fontSize: "1.2vw",
                    fontFamily: "Mitr",
                    fontWeight: 300,
                    letterSpacing: 0,
                  }}
                >
                  DOWNLOAD BATCH RESULT
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ============== Results Section ================== */}
      <div className="flex flex-col responsive-width pb-8 top-10">
        {/* Image selection dropwdown for when the browser gets too small */}   
        <div>
          <select className="responsive-visible image_select_dropdown" value={currentSelectedImage?.input_image_filename} onChange={(e) => setCurrentSelectedImage(data.predictions.find(image => image.input_image_filename === e.target.value))}>
            {data.predictions.map((image) => (
              <option value={image.input_image_filename} key={image.input_image_filename}>
                {image.input_image_filename}
              </option>
            ))}
          </select>
        </div>

        {/* Species Card Section */}
        <div className="relative flex pb-6 border-b-2 border-black border-opacity-10 responsive-card-height move">
          <SpeciesCardGroup image={currentSelectedImage} />
        </div>

        {/* Auxiliary Info Section */}
        <div className="flex bg-white h-2/5 zindex">
          {/* Reference Image Section */}
          <div className="flex flex-col justify-center w-4/12 gap-3 border-r-2 border-black border-opacity-10">
            {/* HEADER */}
            <div className="flex items-center justify-center h-16 ">
              <span
                className="font-sans text-foreground-dark input_image_header"
                style={{
                  fontFamily: "Mitr",
                  fontWeight: 300,
                  letterSpacing: 1,
                }}
              >
                INPUT IMAGE
              </span>
            </div>

            {/* IMAGE FILE */}
            <div>
              <DislplayInputImage image={currentSelectedImage} />
            </div>

            {/* INDIVIDUAL DOWNLOAD */}
            <div className="h-1/12">
              <div className="flex items-center justify-center">
                <button
                  className="flex items-center w-8/12 gap-2 mt-2 cursor-pointer btn"
                  onClick={() =>
                    downloadIndividualFile(
                      currentSelectedImage.input_image_filename
                    )
                  }
                >
                  <div className="w-5 rounded aspect-square">
                    <img
                      src={gray_download_icon}
                      alt="gray download icon"
                      className="items-center w-full h-full return-button style_home"
                    ></img>
                  </div>
                  <span
                  className="responsive-hide"
                    style={{
                      fontSize: "0.8vw",
                      fontFamily: "Geologica",
                      fontWeight: 300,
                      letterSpacing: -0.8,
                      color: "#707070",
                    }}
                  >
                    save results for input
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="flex flex-col justify-center w-8/12 pt-4">
            {/* HEADER */}
            <div className="relative flex items-center h-16 ml-10 justify-left">
              <span
                className="font-sans text-foreground-dark predictions_font"
                style={{
                  // fontFamily: "Mitr",
                  fontFamily: "Mitr",
                  fontWeight: 300,
                  margin: "auto",
                  paddingRight: 6,
                  // color: "#FF5E49",
                }}
              >
                TOP 10 PREDICTIONS
              </span>
            </div>
            {/* TABLE */}
            <div className="relative flex items-center justify-center pl-6 overflow-auto">
              <ResultsTable image={currentSelectedImage} />
            </div>
          </div>
        </div>
      </div>

      {/* The 'return to home page' popup which asks the user if they want to exit the home page. */}
      {showPopup && (
        <div className="popup_background">
          <div className="popup_content">
            {/* Popup text. */}
            <p>
              You are about to go back to the home page. All unsaved data will
              be lost. Do you wish to continue?
            </p>
            {/* Popup buttons. */}
            <span className="popup_container">
              <button className="go_back" onClick={closePopup}>
                Close
              </button>
              <button className="continue" onClick={() => setCurrentPage("")}>
                Continue
              </button>
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

// Function which displays the input image for the user.
function DislplayInputImage({ image }) {
  if (!image) return null;
  return (
    <div
      className="flex overflow-hidden rounded-2xl aspect-square bg-slate-500 flex-center input_img_container"
    >
      <img
        src={`data:image/jpeg;base64,${image.input_image}`}
        alt="input file"
        className="object-cover rounded-2xl input_img"
      />
    </div>
  );
}

// Function which displays the species card (each individual podium column.) for each of the top 3 predicted species.
function SpeciesCardGroup({ image }) {
  if (!image) return null;
  const { predictions } = image;

  return (
    <React.Fragment>
      <SpeciesCard rank={1} {...predictions[1]} />
      <SpeciesCard rank={0} {...predictions[0]} />
      <SpeciesCard rank={2} {...predictions[2]} />
    </React.Fragment>
  );
}

export default ResultsPage;
