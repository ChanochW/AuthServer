const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const randomAccessTokenValue = crypto.randomBytes(64).toString('hex');
const accessTokenEnvVariable = `ACCESS_TOKEN_SECRET="${randomAccessTokenValue}"`;

const randomRefreshTokenValue = crypto.randomBytes(64).toString('hex');
const refreshTokenEnvVariable = `REFRESH_TOKEN_SECRET="${randomRefreshTokenValue}"`;

const parentDir = path.resolve(__dirname, '..');
const envFilePath = path.resolve(parentDir, '.env');

console.log(envFilePath);

function updateEnvFile(filePath, newVariable) {
    let fileContents = '';

    // Check if the .env file exists
    if (fs.existsSync(filePath)) {
        fileContents = fs.readFileSync(filePath, 'utf8');

        // Check if the variable already exists
        const variablePattern = new RegExp(`^${newVariable.split('=')[0]}=.*`, 'm');
        if (variablePattern.test(fileContents)) {
            // Update the existing variable
            fileContents = fileContents.replace(variablePattern, newVariable);
        } else {
            // Append the new variable
            fileContents += `${fileContents ? '\n' : ''}${newVariable}`;
        }
    } else {
        // Create new .env file with the new variable
        fileContents = newVariable;
    }

    // Write the updated content back to the .env file
    fs.writeFileSync(filePath, fileContents, 'utf8');
    console.log(`.env file updated successfully with: ${newVariable.split('=')[0]}`);
}

// Update or create the .env file
updateEnvFile(envFilePath, 'PORT=8080');
updateEnvFile(envFilePath, accessTokenEnvVariable);
updateEnvFile(envFilePath, refreshTokenEnvVariable);
