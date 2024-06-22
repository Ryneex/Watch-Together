import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Room from "@/pages/Room";
import { useEffect } from "react";
import { appStore } from "@/store/appStore";
import { io } from "@/config/socket";

export default function App() {
    useEffect(() => {
        io.on("rooms", (rooms) => (appStore.rooms = rooms));
    }, []);

    return (
        <div className="h-screen w-screen bg-slate-100">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<Room />} />
            </Routes>
        </div>
    );
}
