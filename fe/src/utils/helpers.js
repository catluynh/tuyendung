// export function download(id, name) {
//   AssetApi.download(id).then((response) => {
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", name || "unNamed");
//     document.body.appendChild(link);
//     link.click();
//   });
// }

// export function saveAs(id, name) {
//   AssetApi.download(id).then((response) => {
//     const fileData = new Blob([response.data]);
//     fileSaver(fileData, name);
//   });
// }
