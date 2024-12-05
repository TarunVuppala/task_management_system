import TaskManager from "@/components/TaskManager";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <TaskManager />
      </div>
    </main>
  );
}
