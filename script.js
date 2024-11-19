// Initialize CodeMirror instances
var htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
    mode: "text/html",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true
});

var cssEditor = CodeMirror.fromTextArea(document.getElementById("css-code"), {
    mode: "text/css",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true
});

var jsEditor = CodeMirror.fromTextArea(document.getElementById("js-code"), {
    mode: "text/javascript",
    theme: "dracula",
    lineNumbers: true
});

function run() {
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    const js = jsEditor.getValue();

    const outputFrame = document.getElementById('output');
    const output = outputFrame.contentWindow.document;

    output.open();
    output.write(html + css + `<script>${js}<\/script>`);
    output.close();
}

document.getElementById('runButton').addEventListener('click', run);