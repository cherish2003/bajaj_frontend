import { useState, useEffect } from "react";

function App() {
  const [jsonInput, setJsonInput] = useState(
    '{"data": ["M", "1", "334", "4", "B"]}'
  );
  const [response, setResponse] = useState(null);
  const [visibleSections, setVisibleSections] = useState([
    "Numbers",
    "Characters",
    "Highest alphabet",
  ]);
  const [triggerRequest, setTriggerRequest] = useState(false);
  const [fileData, setFileData] = useState(null); // New state for file data

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      setFileData(base64String.substring(0, 50));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const postData = async () => {
      try {
        const parsedInput = JSON.parse(jsonInput);
        const requestBody = { ...parsedInput, file_b64: fileData };
        const res = await fetch("http://localhost:5000/bfhl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await res.json();

        setResponse(data);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
        alert("Invalid JSON or server error");
      }
    };

    if (triggerRequest) {
      postData();
      setTriggerRequest(false);
    }
  }, [triggerRequest, jsonInput, fileData]);

  const handleVisibilityChange = (section) => {
    setVisibleSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          Siva sai cherish AP21110010001
        </h1>
        <div className="mb-6">
          <label className="flex items-center space-x-2 text-gray-600">
            API Input
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Enter JSON here"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <input type="file" onChange={handleFileUpload} className="mb-4" />{" "}
          {/* File Upload */}
          <button
            onClick={() => setTriggerRequest(true)}
            className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
        {response && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Response
            </h3>
            <div className="flex justify-center space-x-6 mb-6">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={visibleSections.includes("Numbers")}
                  onChange={() => handleVisibilityChange("Numbers")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="hover:text-blue-500 transition-colors duration-200">
                  Numbers
                </span>
              </label>
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={visibleSections.includes("Characters")}
                  onChange={() => handleVisibilityChange("Characters")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="hover:text-blue-500 transition-colors duration-200">
                  Characters
                </span>
              </label>
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={visibleSections.includes("Highest alphabet")}
                  onChange={() => handleVisibilityChange("Highest alphabet")}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="hover:text-blue-500 transition-colors duration-200">
                  Highest Alphabet
                </span>
              </label>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md space-y-4">
              {visibleSections.includes("Numbers") && (
                <div className="p-3 border border-blue-100 rounded-md hover:bg-blue-50 transition duration-150">
                  <p className="text-gray-700 font-medium">Numbers:</p>
                  <p className="text-gray-800">{response.numbers}</p>
                </div>
              )}
              {visibleSections.includes("Characters") && (
                <div className="p-3 border border-blue-100 rounded-md hover:bg-blue-50 transition duration-150">
                  <p className="text-gray-700 font-medium">Characters:</p>
                  <p className="text-gray-800">{response.alphabets}</p>
                </div>
              )}
              {visibleSections.includes("Highest alphabet") && (
                <div className="p-3 border border-blue-100 rounded-md hover:bg-blue-50 transition duration-150">
                  <p className="text-gray-700 font-medium">Highest Alphabet:</p>
                  <p className="text-gray-800">{response.highest_alphabet}</p>
                </div>
              )}

              {!response.file_valid && (
                <div className="p-3 border border-red-100 rounded-md bg-red-50">
                  <p className="text-red-700 font-medium">File is not valid.</p>
                </div>
              )}
              {response.file_valid && (
                <div className="p-3 border border-green-100 rounded-md bg-green-50">
                  <p className="text-green-700 font-medium">File is valid.</p>
                  <p className="text-gray-800">
                    MIME Type: {response.file_mime_type}
                  </p>
                  <p className="text-gray-800">
                    File Size: {response.file_size_kb} KB
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
