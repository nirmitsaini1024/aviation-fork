import  html2pdf  from "html2pdf.js";

const DownloadMessageAsHtml = async (messageText, fileName) => {
  try {
    // Remove any existing container
    const existingContainer = document.getElementById("pdf-generation-container");
    if (existingContainer) {
      document.body.removeChild(existingContainer);
    }

    // Create hidden container
    let hiddenContainer = document.createElement("div");
    hiddenContainer.id = "pdf-generation-container";
    hiddenContainer.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 800px;
      height: auto;
      overflow: visible;
      visibility: hidden;
      pointer-events: none;
      z-index: -100;
      background: white;
    `;
    document.body.appendChild(hiddenContainer);

    const messageContainer = document.createElement("div");
    messageContainer.style.cssText = `
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1f2937;
      background: white;
      width: 100%;
      box-sizing: border-box;
      line-height: 1.6;
    `;

    // Add the message content with improved structure
    messageContainer.innerHTML = `
      <div style="
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      ">
        <div style="
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 24px;
          margin-bottom: 32px;
        ">
          <h1 style="
            color: #1e293b;
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            text-align: center;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            External Source Response
          </h1>
        </div>
        
        <div style="
          display: block;
        ">
          ${messageText}
        </div>
      </div>
    `;

    hiddenContainer.appendChild(messageContainer);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const opt = {
      margin: [0.75, 0.35, 0.75, 0.35],
      filename: fileName.replace(/\.[^/.]+$/, ".pdf"),
      image: { 
        type: "jpeg", 
        quality: 0.98 
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        letterRendering: true,
        allowTaint: false,
        width: 800,
        height: messageContainer.scrollHeight + 100,
      },
      jsPDF: { 
        unit: "in", 
        format: "letter", 
        orientation: "portrait",
        compress: true
      },
    };

    await html2pdf().set(opt).from(messageContainer).save();

    // Cleanup
    if (document.body.contains(hiddenContainer)) {
      document.body.removeChild(hiddenContainer);
    }

  } catch (error) {
    console.error("PDF export failed:", error);
    
    const hiddenContainer = document.getElementById("pdf-generation-container");
    if (hiddenContainer) {
      try {
        document.body.removeChild(hiddenContainer);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }
  }
};

export default DownloadMessageAsHtml;