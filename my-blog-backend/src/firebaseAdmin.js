import fs from 'fs';
import admin from 'firebase-admin';

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

// Export the admin instance
export {
    admin
}