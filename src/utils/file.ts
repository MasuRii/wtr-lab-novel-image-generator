export function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getScriptName() {
  const scriptName = "WTR LAB Novel Image Generator";
  return scriptName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
}
