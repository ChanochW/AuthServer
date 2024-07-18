const fs = require('fs');

const licensePath = '../../LICENSE'; // Path to the LICENSE file
const currentYear = new Date().getFullYear(); // Get the current year

// Read the LICENSE file
let licenseContent = fs.readFileSync(licensePath, 'utf8');

// Define a regular expression to match the year
const yearRegex = /Copyright \(c\) (\d{4})/;

// Find the current year in the LICENSE file
const match = licenseContent.match(yearRegex);

if (match) {
    const existingYear = match[1];

    // Update the year if it's different from the current year
    if (existingYear !== currentYear.toString()) {
        licenseContent = licenseContent.replace(existingYear, currentYear.toString());
        fs.writeFileSync(licensePath, licenseContent);
        console.log(`LICENSE updated from year ${existingYear} to ${currentYear}.`);
    } else {
        console.log(`LICENSE already updated to the current year ${currentYear}.`);
    }
} else {
    console.error('Year not found in LICENSE file.');
}
