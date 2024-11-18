import crypto from 'crypto';

const encryptionKey = process.env.API_ENCRYPTION_KEY; // Ensure this is set in your environment variables
const encryptionMethod = process.env.ENCRYPTION_METHOD; // Ensure this is set in your environment variables

export const checkPassword = async (password, encryptedPassword) => {
    try {
        // Decode the base64 encoded string
        const encryptedBuffer = Buffer.from(encryptedPassword, 'base64');

        // Extract the IV (first 16 bytes)
        const iv = encryptedBuffer.slice(0, 16);

        // Extract the encrypted data
        const encryptedData = encryptedBuffer.slice(16);

        // Ensure the key is 32 bytes
        const key = crypto.createHash('sha256').update(encryptionKey).digest().slice(0, 32);

        // Decrypt the data
        const decipher = crypto.createDecipheriv(encryptionMethod, key, iv);
        let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
        decryptedData += decipher.final('utf8');

        // Compare the decrypted password with the plain text password
        return decryptedData === password;
    } catch (error) {
        console.error("Error verifying password:", error);
        throw new Error("Password verification failed");
    }
};
