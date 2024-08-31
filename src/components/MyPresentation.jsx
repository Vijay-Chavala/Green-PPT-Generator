import React, { useState } from "react";
import pptxgen from "pptxgenjs";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

import Logo from "../images/pgfIcon.png";
import backgroundImagePath from "../images/1.jpg";
import WordImagePath from "../images/B4.jpg";
import Live from "../images/live.gif";

import "./MyPresentation.css"; // Create a CSS file for styling

const MyPresentationWrapper = () => {
  const [fileContent, setFileContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fileName, setFileName] = useState("");

  const onDrop = (acceptedFiles) => {
    setUploading(true); // Add this line to set uploading state
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
    };

    reader.readAsText(file);

    setFileName(file.name);
    setUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".txt",
    maxFiles: 1,
    maxSize: 1024 * 1024, // 1MB
    onDropRejected: () => {
      toast.error("Invalid file. Please upload a valid .txt file.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: false,
        draggable: true,
        pauseOnHover: false,
        type: "error",
        color: "white",
      });
    },
  });

  const generatePresentation = async () => {
    if (!fileContent) {
      toast.error("Please upload a file before generating the presentation.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: false,
        draggable: true,
        pauseOnHover: false,
        type: "error",
        color: "white",
      });
      return;
    }
    setUploading(false); // Reset uploading state

    setDownloading(true);

    const pptx = new pptxgen();
    const lines = fileContent.split("\n");

    // Set the background color for all slides
    pptx.defineSlideMaster({
      title: "MasterSlide",
      background: { color: "#00fe3b" },
    });

    let bibleEncountered = false;

    lines.forEach((line) => {
      if (line.trim() === "Bible") {
        bibleEncountered = true;
      }

      const slide = pptx.addSlide("MasterSlide");

      // Add PGF logo to the slide
      slide.addImage({
        path: Logo,
        x: "2%", // X-coordinate of the top-left corner of the image
        y: "3%", // Y-coordinate of the top-left corner of the image
        w: "4.5%", // Width of the image
        h: "10%", // Height of the image
      });

      // Add "Live" gif to the slide
      slide.addImage({
        path: Live,
        x: "92%", // X-coordinate of the top-left corner of the image
        y: "4%", // Y-coordinate of the top-left corner of the image
        w: "7%", // Width of the image
        h: "5%", // Height of the image
      });

      // Add background image based on whether the line represents "Bible" or other content
      if (line.trim().length !== 0) {
        slide.addImage({
          path: bibleEncountered ? WordImagePath : backgroundImagePath,
          y: "89.94%", // Y-coordinate of the bottom edge of the image
          x: "c", // Center the image horizontally
          w: "100%", // Width of the image
          h: "10%", // Height of the image
          align: "center", // Align the image to the center
        });
      }

      // Add text for the church name
      slide.addText("PGF Telugu Church Bangalore", {
        x: "45%", // X-coordinate of the text box
        y: "56%", // Y-coordinate of the text box
        fontSize: 12, // Font size
        fontFace: "Microsoft YaHei UI", // Font family
        align: "center", // Align the text to the center
        color: "#ffffff", // Text color
        bold: true, // Bold text
        underline: true, // Underline text
        outline: { color: "#000000", size: 0.1 }, // Outline color and size
      });

      // Add contact number
      slide.addText("9  8  4  5  7  5  4  5  1  5", {
        x: "45%", // X-coordinate of the text box
        y: "60%", // Y-coordinate of the text box
        fontSize: 12, // Font size
        fontFace: "Microsoft YaHei UI", // Font family
        align: "center", // Align the text to the center
        color: "#ffffff", // Text color
        bold: true, // Bold text
        outline: { color: "#000000", size: 0.1 }, // Outline color and size
      });

      // Add the content of the current line to the slide
      slide.addText(line, {
        x: "c", // Center the text horizontally
        y: "99%", // Y-coordinate of the text box (near the bottom)
        fontSize: bibleEncountered ? 20 : 22, // Font size
        fontFace: bibleEncountered ? "Mallanna" : "Potti Sreeramulu", // Font family
        align: "center", // Align the text to the center
        valign: "middle", // Vertically align the text to the middle
        w: "100%", // Width of the text box
        color: bibleEncountered ? "#ffffff" : "#ffffff", // Text color
        bold: true, // Bold text
      });
    });

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating delay
    pptx.writeFile("presentation.pptx");
    setDownloading(false);
    // Show success message after downloading
    toast.success("Presentation generated successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: false,
      draggable: true,
      pauseOnHover: false,
      type: "success",
    });
    setTimeout(() => {
      setFileContent("");
      setFileName("");
    }, 0);
  };

  return (
    <div className="presentation-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {fileName && <p>Uploaded File: {fileName}</p>}
        <p>Drag & drop or click to select a .txt file</p>
      </div>
      {uploading && (
        <TailSpin type="Oval" color="#00BFFF" height={30} width={30} />
      )}
      <button
        onClick={generatePresentation}
        disabled={uploading || downloading}
      >
        Generate PowerPoint
      </button>
      {downloading && (
        <TailSpin type="Oval" color="#00BFFF" height={30} width={30} />
      )}
      <ToastContainer />
    </div>
  );
};

export default MyPresentationWrapper;
