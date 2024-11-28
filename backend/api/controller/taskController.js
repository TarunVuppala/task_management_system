const { parse } = require('date-fns');
const prisma = require('../../src/prismaClient');

module.exports.getTasks = async (req, res) => {
    try {
        const { status } = req.query;

        const tasks = status
            ? await prisma.task.findMany({ where: { status: status === "true" } })
            : await prisma.task.findMany();
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ success: false, error: "Failed to fetch tasks" });
    }
};

module.exports.createTask = async (req, res) => {
    try {
        const { title, description, status = false, dueDate } = req.body;

        if (!title || !description || !dueDate) {
            return res.status(400).json({ success: false, error: "Title, description, and due date are required" });
        }

        const parsedDate = parse(dueDate, 'dd/MM/yyyy', new Date());
        if (isNaN(parsedDate)) {
            return res.status(400).json({ success: false, error: "Invalid due date format. Please use dd/mm/yyyy" });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                dueDate: parsedDate,
            },
        });

        res.status(201).json({ success: true, task });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ success: false, error: "Failed to create task" });
    }
};


module.exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate } = req.body;

        if (!title || !description || !dueDate) {
            return res.status(400).json({ success: false, error: "Title, description, and due date are required" });
        }

        const parsedDate = parse(dueDate, 'dd/MM/yyyy', new Date());
        if (isNaN(parsedDate)) {
            return res.status(400).json({ success: false, error: "Invalid due date format. Please use dd/mm/yyyy" });
        }

        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                status,
                dueDate: new Date(parsedDate)
            },
        });
        res.status(200).json({ success: true, task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ success: false, error: "Failed to update task" });
    }
};

module.exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.task.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, error: "Failed to delete task" });
    }
};

module.exports.toggleStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { status: !task.status },
        });

        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        console.error("Error toggling task status:", error);
        res.status(500).json({ success: false, error: "Failed to toggle task status" });
    }
};