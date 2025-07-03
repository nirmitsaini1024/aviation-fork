import { toast } from "sonner";

const handleDownloadFile = (fileName) => {
    try {
      let a = document.createElement("a");
      a.href = "/sample.docx";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.log(error);
      toast.error("Failed, Try again!");
    }
  };

export default handleDownloadFile;