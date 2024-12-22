import { useState } from "react";

function SchoolBranding() {
  // State to manage uploaded logo and branding elements
  const [logo, setLogo] = useState(null);
  const [brandingElements, setBrandingElements] = useState([]);

  // Function to handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can add logic here to handle the uploaded logo file
      // For example, you can save it to the server or display it in the UI.
      setLogo(file);
    }
  };

  // Function to handle branding elements upload
  const handleBrandingElementsUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      // You can add logic here to handle the uploaded branding elements files
      // For example, you can save them to the server or display them in the UI.
      const elements = Array.from(files);
      setBrandingElements(elements);
    }
  };

  return (
    <div className="school-branding">
      <h2>School Branding</h2>
      {/* Logo Upload */}
      <div>
        <h3>Upload School Logo</h3>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
        {logo && <img src={URL.createObjectURL(logo)} alt="School Logo" />}
      </div>
      {/* Branding Elements Upload */}
      <div>
        <h3>Upload Branding Elements</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleBrandingElementsUpload}
        />
        {brandingElements.length > 0 && (
          <div className="branding-elements">
            {brandingElements.map((element, index) => (
              <img
                key={index}
                src={URL.createObjectURL(element)}
                alt={`Branding Element ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SchoolBranding;
