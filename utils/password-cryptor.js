import crypto from 'crypto';

const encryptionKey = process.env.API_ENCRYPTION_KEY; // Ensure this is set in your environment variables
const encryptionMethod = process.env.ENCRYPTION_METHOD; // Ensure this is set in your environment variables

export const hashPassword = async (password) => {
    const iv = crypto.randomBytes(16);

    // Ensure the key is 32 bytes
    const key = crypto.createHash('sha256').update(encryptionKey).digest().slice(0, 32);

    // Encrypt the data
    const cipher = crypto.createCipheriv(encryptionMethod, key, iv);
    let encryptedData = cipher.update(password, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    // Concatenate the IV and encrypted data without base64 encoding the IV
    const combinedData = Buffer.concat([iv, Buffer.from(encryptedData, 'base64')]);

    // Encode the combined data in base64 for easy transfer
    return combinedData.toString('base64');
}
