import { useRequiredDocuments } from "../../hooks/useUploadData";

const RequiredDocuments = ({ uploadedDocuments = [] }) => {
  const { documents } = useRequiredDocuments();

  // const documents = [
  //   {
  //     icon: "file-pdf",
  //     title: "Form Aplikasi",
  //     requiredName: "FormAplikasi.pdf",
  //   },
  //   {
  //     icon: "file-contract",
  //     title: "Akta/AD-ART/SK",
  //     requiredName: "Akta.pdf",
  //   },
  //   { icon: "chart-line", title: "RAT", requiredName: "RAT.pdf" },
  //   { icon: "table", title: "RK 6 Bulan", requiredName: "RK6Bulan.pdf" },
  //   {
  //     icon: "balance-scale",
  //     title: "LK (Neraca/LR/AK)",
  //     requiredName: "LaporanKeuangan.pdf",
  //   },
  //   { icon: "id-card", title: "KTP", requiredName: "KTP.pdf" },
  //   { icon: "building", title: "NIB/NPWP/Izin", requiredName: "NIB.pdf" },
  //   { icon: "home", title: "Dokumen Agunan", requiredName: "Agunan.pdf" },
  // ];

  // const documents = [
  //   {
  //     icon: "file-pdf",
  //     title: "Form Aplikasi",
  //     description: "Wajib",
  //     status: "Belum",
  //     statusColor: "text-red-500",
  //   },
  //   {
  //     icon: "file-contract",
  //     title: "Akta/AD-ART/SK",
  //     description: "Wajib",
  //     status: "Belum",
  //     statusColor: "text-red-500",
  //   },
  //   {
  //     icon: "chart-line",
  //     title: "RAT",
  //     description: "Wajib",
  //     status: "Belum",
  //     statusColor: "text-red-500",
  //   },
  //   {
  //     icon: "table",
  //     title: "RK 6 Bulan",
  //     description: "Wajib",
  //     status: "Belum",
  //     statusColor: "text-red-500",
  //   },
  //   {
  //     icon: "balance-scale",
  //     title: "LK (Neraca/LR/AK)",
  //     description: "Wajib",
  //     status: "Belum",
  //     statusColor: "text-red-500",
  //   },
  //   {
  //     icon: "id-card",
  //     title: "KTP",
  //     description: "Wajib",
  //     status: "Belum",
  //     statusColor: "text-red-500",
  //   },
  //   {
  //     icon: "building",
  //     title: "NIB/NPWP/Izin",
  //     description: "Wajib",
  //     status: "Belum",
  //     statusColor: "text-red-500",
  //   },
  //   {
  //     icon: "home",
  //     title: "Dokumen Agunan",
  //     description: "Opsional",
  //     status: "Opsional",
  //     statusColor: "text-gray-400",
  //   },
  // ];

  const getDocumentStatus = (requiredName) => {
    const isUploaded = uploadedDocuments.some(
      (doc) => doc.fileName === requiredName
    );

    if (isUploaded) {
      return {
        status: "Tersedia",
        color: "text-success",
        icon: "check-circle",
      };
    }

    if (requiredName) {
      return { status: "Belum", color: "text-danger", icon: "times-circle" };
    }

    return { status: "Opsional", color: "text-gray-400", icon: "circle" };
  };

  return (
    <div className="mb-8">
      <h4 className="font-medium text-gray-800 mb-4">
        Dokumen yang Diperlukan
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => {
          const status = getDocumentStatus(doc.requiredName);

          return (
            <div
              key={index}
              className="flex items-center p-3 border border-gray-200 rounded-xl file-item hover:shadow-sm transition"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i className={`fas fa-${doc.icon} text-blue-500`}></i>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{doc.title}</p>
                <p className="text-xs text-gray-500">
                  {doc.description || (doc.requiredName ? "Wajib" : "Opsional")}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <i
                  className={`fas fa-${status.icon} text-sm ${status.color}`}
                ></i>{" "}
                <span className={`text-sm font-semibold ${status.color}`}>
                  {status.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequiredDocuments;
