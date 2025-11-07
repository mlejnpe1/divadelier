const handleDownload = async () => {
  const link = document.createElement("a");
  link.href = "../assets/doc/prihlaska_gdpr_25_26.docx";
  link.download = "prihlaska_gdpr_25_26.docx";
  link.click();
};

export default handleDownload;
