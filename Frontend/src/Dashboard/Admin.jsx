import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import ProtectedAdmin from "../Component/Admin/Admin_Main/ProtectedAdmin";

import Sidebar from "../Component/Admin/Admin_Main/Sidebar";
import Topbar from "../Component/Admin/Admin_Main/Topbar";

import Admindash from "../Component/Admin/Admin_Main/Admin_Dashboard";
import Users from "../Component/Admin/Admin_User/Users";
import Mock from "../Component/Admin/Admin_User/Mock";
import Ebooks from "../Component/Admin/Admin_User/Ebooks";
import Notes from "../Component/Admin/Admin_User/Notes";
import PremiumContent from "../Component/Admin/Admin_User/Premium_content";
import AssignSubjects from "../Component/Admin/Admin_User/AssignSubjects";
import UserDashboard from "../Component/User/UserDashboard";

function AdminWrapper() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Fixed Header */}
            <Topbar
                adminName="Admin"
                onMenuClick={() => setSidebarOpen(true)}
            />

            {/* BODY */}
            <div className="flex pt-16">
                {/* Sidebar */}
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ProtectedAdmin>
            <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route element={<AdminWrapper />}>
                    <Route path="/" element={<Admindash />} />
                    <Route path="user" element={<Users />} />
                    <Route path="mock" element={<Mock />} />
                    <Route path="ebook" element={<Ebooks />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="premium_content" element={<PremiumContent />} />
                    <Route path="assign_subject" element={<AssignSubjects/>} />
                   

                </Route>
            </Routes>
        </ProtectedAdmin>
    );
}
