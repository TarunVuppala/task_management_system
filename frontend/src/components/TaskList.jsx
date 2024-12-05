import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

import TaskItem from "./TaskItem";

import useAppStore from "@/store/useAppStore";

const TaskList = ({ onEditTask }) => {
    const tasks = useAppStore((state) => state.tasks);
    const getTasks = useAppStore((state) => state.getTasks);
    const isLoadingTasks = useAppStore((state) => state.isLoadingTasks);
    const taskError = useAppStore((state) => state.taskError);
    const searchQuery = useAppStore((state) => state.searchQuery);

    useEffect(() => {
        getTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoadingTasks) {
        return (
            <div className="flex justify-center items-center min-h-[200px] p-4">
                <Spinner className="h-10 w-10 text-primary" />
            </div>
        );
    }

    if (taskError) {
        return <p className="text-red-500 text-center p-4">{taskError}</p>;
    }

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                    <TaskItem key={task.id} task={task} onEditTask={onEditTask} />
                ))
            ) : (
                <p className="col-span-full text-center text-muted-foreground p-4">No tasks available</p>
            )}
        </div>
    );
};

export default TaskList;
