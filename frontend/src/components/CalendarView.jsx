import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import useAppStore from '../store/useAppStore';

export default function CalendarView({ onEditTask }) {
    const tasks = useAppStore((state) => state.tasks);

    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };

    const tasksByDate = tasks.reduce((acc, task) => {
        if (!task.due_date) return acc;
        const dateObj = new Date(task.due_date);
        if (!isValidDate(dateObj)) {
            console.warn(`Invalid due_date for task ID ${task.id}: ${task.due_date}`);
            return acc;
        }
        const date = dateObj.toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(task);
        return acc;
    }, {});

    const renderDay = (day) => {
        if (!(day instanceof Date) || isNaN(day)) {
            console.warn(`Invalid day encountered in CalendarView: ${day}`);
            return null;
        }

        const dateStr = day.toISOString().split('T')[0];
        const tasksForDay = tasksByDate[dateStr] || [];

        return (
            <div className="flex flex-col">
                <div className="text-right text-sm font-semibold">{day.getDate()}</div>
                {tasksForDay.length > 0 && (
                    <div className="mt-1 space-y-1">
                        {tasksForDay.map((task) => (
                            <Button
                                key={task.id}
                                variant="ghost"
                                size="xs"
                                className="w-full text-left p-0 text-xs"
                                onClick={() => onEditTask(task)}
                            >
                                • {task.title}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const validSelected = tasks
        .map(task => {
            if (!task.due_date) return null;
            const date = new Date(task.due_date);
            return isValidDate(date) ? date : null;
        })
        .filter(date => date !== null);

    return (
        <Calendar
            mode="single"
            selected={validSelected}
            renderDay={renderDay}
            className="p-4"
        />
    );
}
