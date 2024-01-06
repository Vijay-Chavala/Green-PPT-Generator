import React, { useState } from "react";
import pptxgen from "pptxgenjs";
import Logo from "../images/pgfIcon.png";
import backgroundImagePath from "../images/1.jpg";
import WordImagePath from "../images/B4.jpg";
import Live from "../images/live.gif";
// import Record from "../images/recording.png";

const MyPresentation = () => {
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
      };

      reader.readAsText(file);
    }
  };

  const generatePresentation = () => {
    const pptx = new pptxgen();
    const lines = fileContent.split("\n");

    // Set the background color for all slides
    pptx.defineSlideMaster({
      title: "MasterSlide",
      background: { color: "#00fe3b" },
    });

    let bibleEncountered = false; // Move the initialization outside the loop

    lines.forEach((line) => {
      if (line.trim() === "Bible") {
        bibleEncountered = true;
      }

      const slide = pptx.addSlide("MasterSlide"); // Use the defined master slide
      console.log(line, "line");

      slide.addImage({
        path: Logo,
        x: "4%", // Center horizontally
        y: "5%", // Top-aligned
        w: "5%", // Width (adjust as needed)
        h: "10%", // Height (adjust as needed)
      });
      slide.addImage({
        path: Live,
        x: "90%", // Center horizontally
        y: "4%", // Top-aligned
        w: "7%", // Width (adjust as needed)
        h: "5%", // Height (adjust as needed)
      });
      // slide.addImage({
      //   path: Live,
      //   x: "92%", // Center horizontally
      //   y: "5%", // Top-aligned
      //   w: "auto", // Width (adjust as needed)
      //   h: "auto", // Height (adjust as needed)
      // });
      // slide.addImage({
      //   path: Record,
      //   x: "90%", // Center horizontally
      //   y: "5.5%", // Top-aligned
      //   w: "1.5%", // Width (adjust as needed)
      //   h: "2.5%", // Height (adjust as needed)
      // });

      if (line.trim().length !== 0) {
        slide.addImage({
          path: bibleEncountered ? WordImagePath : backgroundImagePath,
          y: "89.94%",
          x: "c",
          w: "100%",
          h: "10%",
          align: "center",
        });
      }

      slide.addText(line, {
        x: "c", // Center horizontally
        y: "99%", // 92% from the top (adjust as needed)
        // fontSize: bibleEncountered ? 28 : 25,
        fontSize: 25,
        fontFace: bibleEncountered ? "Mallanna" : "Potti Sreeramulu",
        align: "center", // Center the text horizontally
        valign: "middle", // Center the text vertically
        w: "100%", // Full width
        color: bibleEncountered ? "#ffffff" : "#ffffff", // White color in hexadecimal
        bold: true, // Make the text bold
        // outline: {
        //   color: "#000000", // Color of the text stroke (black in hexadecimal)
        //   size: 0.5, // Size of the text stroke
        // },
      });
    });

    // Save the presentation to a file or display it
    pptx.writeFile("presentation.pptx");
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={generatePresentation}>Generate PowerPoint</button>
    </div>
  );
};

export default MyPresentation;
