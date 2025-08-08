import React, { useState } from "react";
import Sidebar from "../partials/Sidebar.jsx";
import Header from "../partials/Header.jsx";
import Banner from "../partials/Banner.jsx";
import FilterButton from "../components/DropdownFilter.jsx";
import Datepicker from "../components/Datepicker.jsx";

function PageLayout({ title, children, extraActions }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        {/* Page header */}
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            {/* Left: Title */}
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                                    {title}
                                </h1>
                            </div>

                            {/* Right: Actions */}
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                <FilterButton align="right" />
                                <Datepicker align="right" />
                                {extraActions}
                            </div>
                        </div>

                        {/* Page content */}
                        {children}
                    </div>
                </main>


            </div>
        </div>
    );
}

export default PageLayout;
