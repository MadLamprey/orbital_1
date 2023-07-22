import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Include the Google Maps API script
const googleMapsScript = document.createElement("script");
googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBPwtP1RTMkif_Kq-lvgzdHClWiPwPDZ6g&libraries=places`;
googleMapsScript.async = true;
googleMapsScript.defer = true;
document.head.appendChild(googleMapsScript);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
