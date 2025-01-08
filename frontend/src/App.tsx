import React, { useState } from "react";
import axios from "axios";
import './App.css'
import { ArrowRight, AudioLines, Loader, Mic } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [queryGenerated, setQueryGenertated] = useState<string>("");
  const [recognizing, setRecognizing] = useState<boolean>(false);


  let recognition: SpeechRecognition | null = null;

  // Initialize Speech Recognition
  if ("webkitSpeechRecognition" in window) {
    recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setRecognizing(true);
    };

    recognition.onend = () => {
      setRecognizing(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      setQuery((prevQuery) => prevQuery + " " + speechResult);
    };
  } else {
    alert("Speech Recognition API not supported in this browser.");
  }


  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    console.log("Uploaded file", file)
    formData.append("file", file);
    setUpload(true);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("File Uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload the file.");
    } finally {
      setLoading(false);
    }
  };

  // Handle query submission
  const handleQuery = async () => {
    if (!query) {
      alert("Please enter a natural language query.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/query", {
        naturalLanguageQuery: query,
      });

      console.log("Response:", response.data, typeof response.data.result)

      // Check if `response.data.result` is an array
      let resultData = Array.isArray(response.data.result) ? response.data.result : [];

      // If `response.data.result` is a string, try to parse it into an array
      if (typeof response.data.result === 'string') {
        try {
          resultData = JSON.parse(response.data.result);
        } catch (error) {
          console.error("Error parsing result:", error);
        }
      }

      console.log("Parsed Data:", resultData)
      // Function to remove slashes from keys and values
      // const removeSlashes = (obj: any) => {
      //   const newObj: any = {};
      //   Object.keys(obj).forEach((key) => {
      //     // Remove slashes from both key and value
      //     const newKey = key.replace(/\//g, '');
      //     const newValue = typeof obj[key] === 'string' ? obj[key].replace(/\//g, '') : obj[key];
      //     newObj[newKey] = newValue;
      //   });
      //   return newObj;
      // };

      // // Remove slashes from each object in the array
      // const cleanedData = resultData.map((item: any) => removeSlashes(item));

      // console.log("Cleaned Data:", cleanedData);
      setQueryGenertated(response.data.query);
      setResult(resultData);
      // setResult(response.data);
    } catch (error) {
      console.error("Query error:", error);
      alert("Failed to process the query.");
    } finally {
      setLoading(false);
    }
  };

  // Function to render result data as a table
  const renderTable = (data: any[]) => {

    if (data.length === 0) {
      return <p>No results found.</p>;
    }

    const headers = Object.keys(data[0]);
    return (
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2",
                  textAlign: "left",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td
                  key={header}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  // const renderPieCharts = (data: any[]) => {
  //   if (data.length === 0) {
  //     return <p>No data available for charts.</p>;
  //   }

  //   return data.map((row, index) => {
  //     const keys = Object.keys(row);
  //     const values = Object.values(row);

  //     console.log("Keys", keys);
  //     console.log("Values:", values);

  //     const chartData = {
  //       labels: keys,
  //       datasets: [
  //         {
  //           label: `Row ${index}`,
  //           data: values.map((value) => (typeof value === "number" ? value : 1)), // Assume `1` for non-numeric values
  //           backgroundColor: [
  //             "#FF6384",
  //             "#36A2EB",
  //             "#FFCE56",
  //             "#4BC0C0",
  //             "#9966FF",
  //             "#FF9F40",
  //           ],
  //         },
  //       ],
  //     };

  //     const options = {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           position: "top" as const,
  //         },
  //       },
  //     };

  //     return (
  //       <div key={index} style={{ marginBottom: "20px" }}>
  //         <h3>Row {index + 1}</h3>
  //         <Pie data={chartData} options={options} />
  //       </div>
  //     );
  //   });
  // };

  return (
    <div className="container" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>DuckDB Query Interface</h1>

      {/* File Upload Section */}
      {/* <div style={{ marginBottom: "20px" }} className="upload-box">
        <h2>Upload CSV</h2>
        <div className="choose-file">
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
        {file && <button
          onClick={handleUpload}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>}
      </div> */}
      <div
        style={{ marginBottom: "20px", border: "2px dashed #ccc", padding: "20px", textAlign: "center" }}
        className="upload-box"
        onDragOver={(e) => e.preventDefault()} // Prevent default behavior to allow drop
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) {
            setFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <h2>Upload CSV</h2>
        <div className="drag-drop">
          <h2>Drag and Drop your file here or click on Choose File.</h2>
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            // backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Choose File
        </label>
        {file && (
          <div style={{ marginTop: "10px" }}>
            <strong>Selected File:</strong> {file.name}
          </div>
        )}
        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{ marginLeft: "10px", marginTop: "10px" }}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>

      {/* Query Section */}
      {upload && <div style={{ marginBottom: "20px" }} className="query-box">
        <h3>Enter a Query</h3>
        <textarea
          placeholder="Enter your natural language query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        />
        {/* <button
          onClick={handleQuery}
          disabled={loading}
          style={{ marginTop: "10px" }}
        >
          {loading ? "Processing..." : "Run Query"}
        </button> */}
        <button
          className=""
          style={{ marginTop: "10px" }}
          disabled={loading}
          onClick={handleQuery}
        >
          {loading ? <Loader /> : <ArrowRight size={18} className='text-white' />}

        </button>
        <button
          onClick={() => recognition?.start()}
          disabled={recognizing}
          style={{
            marginLeft: "10px",
            marginTop: "10px",
            backgroundColor: recognizing ? "gray" : "#4caf50",
            color: "white",
          }}
        >
          {/* {recognizing ? "Listening..." : "Start Voice Input"} */}
          {recognizing ? <AudioLines /> : <Mic />}
          {/* <Mic /> */}
        </button>
      </div>}

      {/* Query Results Section */}
      {result && (
        <div>
          <h2>Query Results</h2>
          <p>
            <strong>Query:</strong> {queryGenerated}
          </p>
          <p>
            <strong>Result Length:</strong> {result.length}
          </p>
          <div className="table-disp">
            {Array.isArray(result) ? (
              renderTable(result)
            ) : (
              <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
          </div>

          {/* {renderPieCharts(result)} */}
        </div>
      )}
    </div>
  );
};

export default App;
