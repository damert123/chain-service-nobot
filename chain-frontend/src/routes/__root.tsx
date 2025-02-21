import { Sidebar } from "@/widgets/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div>
      <div className="flex overflow-hidden bg-[#F7F7F9]">
        <Sidebar />

        <main className="relative h-screen w-full px-4 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  ),
});
