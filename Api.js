const express = require("express");
const path = require("path");
const bodyP = require("body-parser");
const compiler = require("compilex");
const cors = require("cors");

const app = express();
const options = { stats: true };
compiler.init(options);

app.use(bodyP.json());
app.use(cors());

// Serve the index.html (frontend) from the project directory
app.get("/", function (req, res) {
  // Dynamically serve the index.html file
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Generic function to compile code based on language
function compileCode(envData, code, input, compileFunc, compileFuncWithInput, res) {
  if (!input) {
    compileFunc(envData, code, function (data) {
      if (data.output) {
        return res.send(data);
      } else {
        return res.send({ output: "error" });
      }
    });
  } else {
    compileFuncWithInput(envData, code, input, function (data) {
      if (data.output) {
        return res.send(data);
      } else {
        return res.send({ output: "error" });
      }
    });
  }
}

// Compilation endpoint
app.post("/compile", function (req, res) {
  const code = req.body.code;
  const input = req.body.input;
  const lang = req.body.lang;

  try {
    let envData;

    switch (lang) {
      case "Cpp":
      case "C":
        envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
        compileCode(envData, code, input, compiler.compileCPP, compiler.compileCPPWithInput, res);
        break;

      case "Java":
        envData = { OS: "windows" };
        compileCode(envData, code, input, compiler.compileJava, compiler.compileJavaWithInput, res);
        break;

      case "Python":
        envData = { OS: "windows" };
        compileCode(envData, code, input, compiler.compilePython, compiler.compilePythonWithInput, res);
        break;

      default:
        return res.status(400).send({ error: "Unsupported language" });
    }
  } catch (error) {
    console.log("Error:", error);
    if (!res.headersSent) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
});

// Start the server on port 8080
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
