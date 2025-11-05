import { AppBar } from "@/components/AppBar";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="bg-gray-900 min-h-screen">
      <AppBar />
      <Dashboard />
    </main>
  );
}