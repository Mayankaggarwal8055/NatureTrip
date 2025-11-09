const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    
    const { updatedProfileData, userId } = req.body

    try {

        const userProfile = await prisma.userProfile.upsert({

            where: { userId: userId },
            update: {
                firstName: updatedProfileData.firstName,
                lastName: updatedProfileData.lastName,
                gender: updatedProfileData.gender,
                dob: updatedProfileData.dob ? new Date(updatedProfileData.dob) : null,
                mobile: updatedProfileData.mobile,
                passport: updatedProfileData.passport,
                expiryDate: updatedProfileData.expiryDate ? new Date(updatedProfileData.expiryDate) : null,
            },
            create: {
                userId: userId,
                firstName: updatedProfileData.firstName,
                lastName: updatedProfileData.lastName,
                gender: updatedProfileData.gender,
                dob: updatedProfileData.dob ? new Date(updatedProfileData.dob) : null,
                mobile: updatedProfileData.mobile,
                passport: updatedProfileData.passport,
                expiryDate: updatedProfileData.expiryDate ? new Date(updatedProfileData.expiryDate) : null,
            },
        })
        
        res.json(userProfile)
    } catch (error) {
        console.error(error)
    }

})

module.exports = router

