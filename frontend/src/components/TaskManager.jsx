import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Calendar, List } from "lucide-react";

import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import CalendarView from "./CalendarView";

import useAppStore from "../store/useAppStore";

function TaskManager() {
  const { createTask, updateTask, setSearchQuery, searchQuery } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(undefined);
  const [currentView, setCurrentView] = useState('list');

  const handleAddTask = () => {
    setCurrentTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task) => {
    if (currentTask) {
      updateTask(currentTask.id, task);
    } else {
      createTask(task);
    }
    setIsModalOpen(false);
  };

  const setView = (view) => {
    setCurrentView(view);
    localStorage.setItem('taskView', view);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Task Manager</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <Input
          className="w-full sm:max-w-sm"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-wrap justify-center sm:justify-end space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
          <Button
            variant={currentView === 'list' ? 'primary' : 'outline'}
            onClick={() => setView('list')}
            aria-pressed={currentView === 'list'}
            className="flex items-center justify-center"
          >
            <List className="mr-2 h-4 w-4" /> List View
          </Button>
          <Button
            variant={currentView === 'calendar' ? 'primary' : 'outline'}
            onClick={() => setView('calendar')}
            aria-pressed={currentView === 'calendar'}
            className="flex items-center justify-center"
          >
            <Calendar className="mr-2 h-4 w-4" /> Calendar View
          </Button>
          <Button onClick={handleAddTask} className="flex items-center justify-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>
      <div className="w-full">
        {currentView === 'list' ? (
          <TaskList onEditTask={handleEditTask} />
        ) : (
          <CalendarView onEditTask={handleEditTask} />
        )}
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={currentTask}
      />
    </div>
  );
}

export default TaskManager;