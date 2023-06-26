import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("http://localhost:5001/getImages");
        setImages(res.data);
      } catch (ex) {
        console.log(ex);
      }
    };

    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("fileName", fileName);
    try {
      const res = await axios.post(
        "http://localhost:5001/uploadImage",
        formData
      );
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px" }}>
      <h1>Image Upload and display</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
          }}
          style={{ border: "1px solid #ccc", padding: "5px" }}
        />
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <h1>Image Gallery</h1>
      <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "10px",
  justifyItems: "center",
  alignItems: "center"
}}>
  {images.map((image) => (
    <img
      key={image.id}
      src={image.path}
      alt="Uploaded Image"
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid black",
        boxShadow: "2px 2px 12px black",
      }}
    />
  ))}
</div>

    </div>
  );
};

export default ImageForm;
