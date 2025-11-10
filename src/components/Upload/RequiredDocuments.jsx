import { useRequiredDocuments } from "../../hooks/useUploadData";

const RequiredDocuments = ({ uploadedDocuments = [] }) => {
    const { documents } = useRequiredDocuments();


    const getDocumentStatus = (requiredTitle) => {
        const isUploaded = uploadedDocuments.some(
            (doc) => doc.requiredName === requiredTitle
        );

        if (isUploaded) {
            return {
                status: "Tersedia",
                color: "text-green-500",
                icon: "check-circle",
            };
        }

        if (requiredTitle) {
            return { status: "Belum", color: "text-red-500", icon: "times-circle" };
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
                    // ⭐️ Meneruskan nama dokumen wajib untuk status check
                    const status = getDocumentStatus(doc.title);

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
                                    {/* Gunakan description jika ada, jika tidak, tentukan wajib/opsional */}
                                    {doc.description || (doc.title !== "Dokumen Agunan" ? "Wajib" : "Opsional")}
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
