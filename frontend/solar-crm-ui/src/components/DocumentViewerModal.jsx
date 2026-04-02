import "./customerModal.css";

function DocumentViewerModal({ fileUrl, fileName, onClose }) {

  if (!fileUrl) return null;

  const lowerUrl = fileUrl.toLowerCase();
  const isImage = /\.(jpg|jpeg|png|webp|avif|gif)$/.test(lowerUrl);

  // const isImage =
  //   lowerUrl.includes(".jpg") ||
  //   lowerUrl.includes(".jpeg") ||
  //   lowerUrl.includes(".png") ||
  //   lowerUrl.includes(".webp");

  const isPdf = lowerUrl.includes(".pdf");

  // PDF open directly
  if (isPdf) {
    window.open(fileUrl, "_blank");
    onClose();
    return null;
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="viewerModal" onClick={(e)=>e.stopPropagation()}>

        <h3>{fileName}</h3>

        {isImage ? (
          <img src={fileUrl} alt={fileName} className="viewerImg"
          onError={(e) => {
              e.target.onerror = null; 
              e.target.src="https://via.placeholder.com/300?text=Error+Loading+Image";
            }}
            />
        ) : (
          <div className="unsupported-box">
           <p>Preview not supported for this file type.</p>
            <br/>
            <a href={fileUrl} target="_blank" rel="noreferrer">Open in New Tab</a>
          </div>
        )}

        <button className="closeBtn" onClick={onClose}>Close</button>

      </div>
    </div>
  );
}

export default DocumentViewerModal;