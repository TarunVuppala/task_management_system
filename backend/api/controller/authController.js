const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../../src/prismaClient');

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, error: "Failed to log in" });
    }
};

module.exports.signup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ success: false, error: "Failed to sign up" });
    }
};
