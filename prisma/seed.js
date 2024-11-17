// // const { PrismaClient } = require('@prisma/client');
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function main() {
//     // Check if the user already exists
//     const existingUser = await prisma.user.findUnique({
//         where: { username: 'ipgautomotive' },
//     });

//     if (!existingUser) {
//         // Create the user if it doesn't exist
//         await prisma.user.create({
//             data: {
//                 username: 'ipgautomotive',
//                 password: 'carmaker', // In a real app, store hashed passwords!
//                 name: 'IPG Automotive User',
//             },
//         });

//         console.log('User created: ipgautomotive');
//     } else {
//         console.log('User already exists.');
//     }
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
        where: { username: 'ipgautomotive' },
    });

    if (!existingUser) {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash('carmaker', 10); // 10 is the salt rounds

        // Create the user if it doesn't exist
        await prisma.user.create({
            data: {
                username: 'ipgautomotive',
                password: hashedPassword, // Store the hashed password
                name: 'IPG Automotive User',
            },
        });

        console.log('User created: ipgautomotive');
    } else {
        console.log('User already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
