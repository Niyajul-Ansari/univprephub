import { useNavigate } from "react-router-dom";
import ActionCard from "./ActionCard";
import InfoCard from "./InfoCard";

import {
    adminData,
    quickActions,
} from "../../../Data/AdminData";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-semibold">
                    Welcome, {adminData.name} 👋
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your platform content, users, and premium resources efficiently.
                </p>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard label="Admin Name" value={adminData.name} />
                <InfoCard label="Email" value={adminData.email} />
                <InfoCard label="Role" value={adminData.role} />
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <ActionCard
                            key={action.id}
                            title={action.title}
                            onClick={() => {
                                if (action.path) {
                                    navigate(`/admin/${action.path}`);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}