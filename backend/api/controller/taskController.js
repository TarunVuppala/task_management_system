const { parse } = require('date-fns');
const prisma = require('../../src/prismaClient');

module.exports.getTasks = async (req, res) => {
    const { userId } = req.user;
    const { isCompleted } = req.query;

    try {
        const tasks = isCompleted
            ? await prisma.task.findMany({
                  where: {
                      user_id: userId,
                      is_completed: isCompleted === 'true',
                  },
              })
            : await prisma.task.findMany({
                  where: { user_id: userId },
              });

        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ success: false, error: "Failed to fetch tasks" });
    }
};

module.exports.createTask = async (req, res) => {
    const { userId } = req.user;

    try {
        const { title, description, isCompleted = false, dueDate } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({ success: false, error: "Title and due date are required" });
        }

        const parsedDate = parse(dueDate, 'dd/MM/yyyy', new Date());
        if (isNaN(parsedDate)) {
            return res.status(400).json({ success: false, error: "Invalid due date format. Please use dd/mm/yyyy" });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                is_completed: isCompleted,
                due_date: parsedDate,
                user_id: userId,
            },
        });

        res.status(201).json({ success: true, task });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ success: false, error: "Failed to create task" });
    }
};

module.exports.updateTask = async (req, res) => {
    const { userId } = req.user;

    try {
        const { id } = req.params;
        const { title, description, isCompleted, dueDate } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({ success: false, error: "Title and due date are required" });
        }

        const parsedDate = parse(dueDate, 'dd/MM/yyyy', new Date());
        if (isNaN(parsedDate)) {
            return res.status(400).json({ success: false, error: "Invalid due date format. Please use dd/mm/yyyy" });
        }

        const task = await prisma.task.updateMany({
            where: { id: parseInt(id), user_id: userId },
            data: {
                title,
                description,
                is_completed: isCompleted,
                due_date: parsedDate,
            },
        });

        if (task.count === 0) {
            return res.status(404).json({ success: false, error: "Task not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Task updated successfully" });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ success: false, error: "Failed to update task" });
    }
};

module.exports.deleteTask = async (req, res) => {
    const { userId } = req.user;
    const { id } = req.params;

    try {
        const task = await prisma.task.deleteMany({
            where: { id: parseInt(id), user_id: userId },
        });

        if (task.count === 0) {
            return res.status(404).json({ success: false, error: "Task not found or unauthorized" });
        }

        res.status(204).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, error: "Failed to delete task" });
    }
};

module.exports.toggleStatus = async (req, res) => {
    const { userId } = req.user;
    const { id } = req.params;

    try {
        const task = await prisma.task.findFirst({
            where: { id: parseInt(id), user_id: userId },
        });

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found or unauthorized" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: task.id },
            data: { is_completed: !task.is_completed },
        });

        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        console.error("Error toggling task status:", error);
        res.status(500).json({ success: false, error: "Failed to toggle task status" });
    }
};
