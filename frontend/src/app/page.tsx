import TaskBoard from "@/components/TaskBoard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        Team Task Board
      </h1>
      <TaskBoard />
    </main>
  );
}
