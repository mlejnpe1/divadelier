import gdprPdf from "../assets/doc/prihlaska_gdpr_26_27.pdf?url";

const handleDownload = () => {
  const link = document.createElement("a");
  link.href = gdprPdf;
  link.download = "prihlaska_gdpr_26_27.pdf";
  link.click();
};

export default handleDownload;
