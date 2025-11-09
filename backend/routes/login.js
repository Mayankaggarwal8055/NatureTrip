const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await prisma.userRecord.findUnique({
            where: { email: email },
            select: { id: true, name: true, email: true, password: true }
        })

        if (!user) {
            return res.status(400).json({ error: 'user is not registered !! please signup first!!' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '1d' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // must always be true for cross-site cookies
            sameSite: 'None', // REQUIRED for cross-site cookies
            maxAge: 86400000,
        });



        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email }
        });


    } catch (error) {
        res.status(500).json({ error: 'Server error, please try again later.' })

    }

})

module.exports = router