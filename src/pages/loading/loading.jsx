import RootContext from "../../providers/root";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import logo from "../../assets/ui-elements/logo.png";
import "./loading.css";

const LoadingPage = () => {
  const {
    selectedImages,
    setSelectedImages,
    setData,
    setCurrentPage,
    selectedValue,
  } = useContext(RootContext);
  const [uploadStatus, setUploadStatus] = useState(""); // Displays the status of the image upload
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    const formData = new FormData();
    selectedImages.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    const fetchData = async () => {
      // Declare an async function
      try {
        // Send a POST request to the '/classify' endpoint in the backend to upload the image
        const response = await axios.post(
          `http://localhost:5000/classify/${selectedValue}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Stores the return prediction value of the endpoints and stores it in a global variable
        const predictions = response.data;
        console.log(predictions);
        setData({ predictions });

        setTransition(true);
        setTimeout(() => {
          setUploadStatus("Image uploaded successfully!"); // Set image upload status
          setSelectedImages([]); // Clear the selected image after successful upload
          setCurrentPage("results");
        }, "2000");
      } catch (error) {
        // Display errors/status if there is an error
        console.error("Error uploading image:", error);
        setUploadStatus("Error uploading image: " + error.message);
      }
    };

    fetchData(); // Call the async function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Status message if there is an error */}
      <p>{uploadStatus}</p>
      <div
        className={`loading_container  ${
          transition ? "loading_container_transition" : ""
        }`}
      >
        <img
          className={`logo ${transition ? "logo_transition" : ""}`}
          src={logo}
          alt="insect logo"
        ></img>
        <div id="loading-bar-spinner" className="spinner">
          <div
            className={`spinner-icon ${transition ? "spinner_transition" : ""}`}
          ></div>
        </div>
        <p className="loading_text">we're working on it!</p>
      </div>
    </div>
  );
};

export default LoadingPage;
