import AppHeader from "@/components/app/AppHeader";
import Workspace from "@/components/app/Workspace";

export default function AppPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-grid">
      <AppHeader />
      <main className="flex-1">
        <Workspace />
      </main>
    </div>
  );
}
