let pyodideInstance;

self.onmessage = async (event) => {
  const { code, input } = event.data;
  let output = "";
  let error = "";
  try {
    if (!pyodideInstance) {
      self.postMessage({ type: "status", message: "loading" });
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
      });
    }
    pyodideInstance.setStdout({
      batched: (text) => {
        output += `${text}\n`;
      },
    });
    pyodideInstance.setStderr({
      batched: (text) => {
        output += `${text}\n`;
      },
    });
    const inputCharacters = [...`${input || ""}\n`].map((character) =>
      character.charCodeAt(0),
    );
    pyodideInstance.setStdin({
      stdin: () => inputCharacters.shift() ?? null,
      isatty: true,
    });
    await pyodideInstance.runPythonAsync(code);
  } catch (exception) {
    error = exception?.message || String(exception);
    if (!output) output = error;
  }
  self.postMessage({ type: "result", output: output.trimEnd(), error });
};
