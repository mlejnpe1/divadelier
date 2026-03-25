import gdprDocx from "../assets/doc/prihlaska_gdpr_25_26.docx?url";

const handleDownload = () => {
  const link = document.createElement("a");
  link.href = gdprDocx;
  link.download = "prihlaska_gdpr_25_26.docx";
  link.click();
};

export default handleDownload;
