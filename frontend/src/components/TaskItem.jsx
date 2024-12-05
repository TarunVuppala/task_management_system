import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

import DeleteConfirmation from "./DeleteConfirmation";

import useAppStore from "@/store/useAppStore";

const TaskItem = ({ task, onEditTask }) => {
    const { toggleTaskStatus, deleteTask } = useAppStore();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDeleteOpen(false);
    };

    const handleConfirmDelete = () => {
        deleteTask(task.id);
        setIsDeleteOpen(false);
    };

    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const formattedDueDate = dueDate && !isNaN(dueDate)
        ? dueDate.toLocaleDateString()
        : "Invalid Date";

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">{task.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-2">{task.description}</p>
                <p className="text-sm sm:text-base mb-2 text-gray-500">Due: {formattedDueDate}</p>
                <div className="mt-2 flex items-center">
                    {task.is_completed ? (
                        <span
                            className="inline-flex items-center text-green-600 cursor-pointer"
                            onClick={() => toggleTaskStatus(task.id)}
                        >
                            <CheckCircle className="w-4 h-4 mr-1" /> Complete
                        </span>
                    ) : (
                        <span
                            className="inline-flex items-center text-red-600 cursor-pointer"
                            onClick={() => toggleTaskStatus(task.id)}
                        >
                            <XCircle className="w-4 h-4 mr-1" /> Incomplete
                        </span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 p-4 sm:p-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditTask(task)}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-3"
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteClick}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-3"
                >
                    Delete
                </Button>
            </CardFooter>
            {isDeleteOpen && (
                <DeleteConfirmation
                    task={task}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </Card>
    );
};

export default TaskItem;