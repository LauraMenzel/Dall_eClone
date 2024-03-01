import { useState, useEffect } from "react";
import Modal from "./components/Modal.js";
const App = () => {
  const [value, setValue] = useState("");
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const surpriseOptions = [
    "A blue ostrich eating melon",
    "A matisse style shark on the telephone",
    "A pineapple sunbathing on an island",
  ];

  const surpriseMe = () => {
    setImages(null);
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getImages = async () => {
    setImages(null);
    if (value === null) {
      setError("Error! Must have a search term");
      return;
    }
    try {
      console.log("Prompt Value:", value);

      if (typeof value !== "string") {
        console.error("Invalid type for value. Expected string.");
        alert("Invalid type for value. Expected string.");
        return;
      }
      console.log("Prompt Value:", value);
      console.log("Request Body:", { message: value });
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: String(value),
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log("Prompt Value Type:", typeof value);
      const response = await fetch("http://localhost:8000/images", options);
      const data = await response.json();

      if (response.ok) {
        setImages(Array.isArray(data) ? data : [data]);
      } else {
        // Handle error response from the server
        console.error("Server error:", data);
        alert(`Server error: ${data.error}`);
        setImages(null); // or set an appropriate default value
      }
    } catch (error) {
      console.error(error);
      alert("Unexpected error occurred");
      setImages(null); // or set an appropriate default value
    }
  };

  console.log(value);

  const uploadImage = async (e) => {
    console.log("uploaded Image clicked");
    console.log(e.target.files[0]);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();
      console.log("uploaded Response", data);

      setSelectedImage(e.target.files[0]);
    } catch (error) {
      console.error("uploaded Error", error);
    }
  };

  useEffect(() => {
    console.log("selected Image after setting", selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    console.log("Modal open status:", modalOpen);
  }, [modalOpen]);

  return (
    <div className="app">
      <section className="search-section">
        <p>
          Start with a detailed discription{" "}
          <span className="surprise" onClick={surpriseMe}>
            Surprise me
          </span>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="An impressionist oil painting of a sunflower"
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={getImages} disabled={!value}>
            {" "}
            Generate
          </button>
        </div>
        <p className="extra-info">
          Or,{" "}
          <span>
            <label htmlFor="files">upload an image </label>
            <input
              onChange={uploadImage}
              id="files"
              accept="image/*"
              type="file"
              hidden
            ></input>
          </span>
          to edit.
        </p>
        {error && <p>{error}</p>}
        {modalOpen && (
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
            />
          </div>
        )}
      </section>
      <section className="image-section">
        {images?.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`Generated image of ${value}`}
          />
        ))}
      </section>
    </div>
  );
};

export default App;
