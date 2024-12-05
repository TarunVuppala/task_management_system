import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function TaskModal({ task, onClose, isOpen, onSave }) {
    
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [dueDate, setDueDate] = useState(task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
    const [isCompleted, setIsCompleted] = useState(task?.is_completed || false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
            setIsCompleted(task.is_completed);
        } else {
            
            setTitle('');
            setDescription('');
            setDueDate('');
            setIsCompleted(false);
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            due_date: new Date(dueDate).toISOString(),  
            is_completed: isCompleted,                  
        };

        onSave(taskData);  
        onClose();         
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isCompleted"
                            checked={isCompleted}
                            onCheckedChange={(checked) => setIsCompleted(checked)}
                        />
                        <Label htmlFor="isCompleted">Completed</Label>
                    </div>
                    <DialogFooter>
                        <Button type="submit">{task ? 'Update' : 'Add'} Task</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
