import "./customerModal.css";

function DocumentViewerModal({ fileUrl, fileName, onClose }) {

  const isImage =
    fileUrl.endsWith(".jpg") ||
    fileUrl.endsWith(".jpeg") ||
    fileUrl.endsWith(".png");

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="viewerModal" onClick={(e)=>e.stopPropagation()}>

        <h3>{fileName}</h3>

        {isImage ? (
          <img src={fileUrl} alt="doc" className="viewerImg"/>
        ) : (
          <iframe src={fileUrl} width="100%" height="500"></iframe>
        )}

        <button className="closeBtn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}

export default DocumentViewerModal;