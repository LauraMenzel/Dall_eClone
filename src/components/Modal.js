import React, { useState, useEffect } from "react";

const Modal = ({ setModalOpen, setSelectedImage, selectedImage }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      console.log("Object URL:", URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const closeModal = () => {
    console.log("Closing modal");
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="modal">
      <div onClick={closeModal}>X</div>
      <div className="img-container">
        {selectedImage ? (
          <img src={URL.createObjectURL(selectedImage)} alt="uploaded Image" />
        ) : (
          <p>No image selected</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
