import ApplicationInfo from "../components/Upload/ApplicationInfo";
import DocumentUpload from "../components/Upload/DocumentUpload";
import UploadHistory from "../components/Upload/UploadHistory";

const Upload = () => {
  return (
    <div className="flex-1 overflow-auto p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <ApplicationInfo />
        <DocumentUpload />
        <UploadHistory />
      </div>
    </div>
  );
};

export default Upload;
