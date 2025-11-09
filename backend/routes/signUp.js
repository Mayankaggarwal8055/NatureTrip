const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
   

    try {

        const { name, email, password } = req.body;

        const existingUser = await prisma.userRecord.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        const salt = await bcrypt.genSalt(12)
        const hashed = await bcrypt.hash(password, salt)

        const userRecord = await prisma.userRecord.create({
            data: {
                name,
                email,
                password: hashed
            }
        })

        const token = jwt.sign({ userId: userRecord.id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400000
        })

        const user = await prisma.userRecord.findUnique({
            where: { id: userRecord.id },
            select: { id: true, name: true, email: true }
        })


        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email },
            message: 'Signup successful'
        })


    } catch (error) {
        res.status(400).json({ error })
    }


})

module.exports = router;
