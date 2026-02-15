import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ✅ SAME VERSION WORKER (NO MISMATCH)
pdfjs.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.js";

export default function PdfCanvasViewer({ fileUrl }) {
    const [numPages, setNumPages] = useState(null);

    return (
        <div className="w-full flex justify-center bg-gray-900 py-6">
            <div className="w-full max-w-4xl space-y-6">
                <Document
                    file={fileUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<p className="text-white text-center">Loading PDF…</p>}
                    error={<p className="text-red-400 text-center">PDF load failed</p>}
                >
                    {Array.from({ length: numPages || 0 }, (_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded shadow overflow-hidden"
                        >
                            <Page
                                pageNumber={i + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                width={800}
                            />
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
}
