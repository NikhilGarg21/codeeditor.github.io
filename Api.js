const express = require("express");
const app = express();
const bodyP = require("body-parser");
const compiler = require("compilex");
const cors = require("cors");

const options = { stats: true };
compiler.init(options);

app.use(bodyP.json());
app.use(cors());

// Remove the local CodeMirror static file serving, as it's no longer needed
// app.use(
//   "/codemirror/codemirror-5.65.18",
//   express.static(
//     "C:/Users/ngarg/Downloads/CodeEditor/codemirror/codemirror-5.65.18"
//   )
// );

// Serve the index.html (frontend)
app.get("/", function (req, res) {
  compiler.flush(function () {
    console.log("deleted");
  });
  // Adjust this path to where your 'index.html' is actually located
  res.sendFile("C:/Users/ngarg/Downloads/CodeEditor/index.html");
});

// Compilation endpoint
app.post("/compile", function (req, res) {
  const code = req.body.code;
  const input = req.body.input;
  const lang = req.body.lang;

  try {
    let envData;

    // Handle different language compilations
    if (lang === "Cpp" || lang === "C") {
      envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      if (!input) {
        compiler.compileCPP(envData, code, function (data) {
          if (data.output) {
            return res.send(data);
          } else {
            return res.send({ output: "error" });
          }
        });
      } else {
        compiler.compileCPPWithInput(envData, code, input, function (data) {
          if (data.output) {
            return res.send(data);
          } else {
            return res.send({ output: "error" });
          }
        });
      }
    } else if (lang === "Java") {
      envData = { OS: "windows" };
      if (!input) {
        compiler.compileJava(envData, code, function (data) {
          if (data.output) {
            return res.send(data);
          } else {
            return res.send({ output: "error" });
          }
        });
      } else {
        compiler.compileJavaWithInput(envData, code, input, function (data) {
          if (data.output) {
            return res.send(data);
          } else {
            return res.send({ output: "error" });
          }
        });
      }
    } else if (lang === "Python") {
      envData = { OS: "windows" };
      if (!input) {
        compiler.compilePython(envData, code, function (data) {
          if (data.output) {
            return res.send(data);
          } else {
            return res.send({ output: "error" });
          }
        });
      } else {
        compiler.compilePythonWithInput(envData, code, input, function (data) {
          if (data.output) {
            return res.send(data);
          } else {
            return res.send({ output: "error" });
          }
        });
      }
    } else {
      return res.status(400).send({ error: "Unsupported language" });
    }
  } catch (error) {
    console.log("Error", error);
    if (!res.headersSent) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
});

// Start the server on port 8080
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
