import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPremiumList() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/api/premium-content/all").then((res) => setData(res.data));
    }, []);

    return (
        <table className="w-full mt-6 border">
            <thead className="bg-gray-900 text-white">
                <tr>
                    <th>Sr</th>
                    <th>Subject</th>
                    <th>Topic</th>
                    <th>Hidden?</th>
                    <th>Video</th>
                    <th>PDF</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, i) => (
                    <tr key={item._id} className="text-center border-b">
                        <td>{i + 1}</td>
                        <td>{item.subject}</td>
                        <td>{item.topicName}</td>
                        <td>{item.isHidden ? "Yes" : "No"}</td>
                        <td>
                            {item.videoLink && (
                                <a href={item.videoLink} target="_blank">Video</a>
                            )}
                        </td>
                        <td>
                            {item.pdfLink && (
                                <a href={item.pdfLink} target="_blank">PDF</a>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
