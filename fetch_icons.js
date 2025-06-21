const https = require('https');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const API_KEY = 'FPSXe17f065b34c74a06a977a0f6fb5b7f08';
const BASE_URL = 'https://api.flaticon.com/v3';

const categories = {
    starter: [
        'student',
        'teacher',
        'desk',
        'chair',
        'pencil',
        'eraser',
        'notebook',
        'book',
        'classroom',
        'whiteboard',
        'school bell',
        'backpack'
    ]
};

// --- Helper Functions ---

// Function to make authenticated requests
const makeRequest = (url, options = {}, body = null) => {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        // Handle non-JSON responses for file downloads
                        resolve(data);
                    }
                } else {
                    reject(new Error(`HTTP status code ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        if (body) {
            req.write(body);
        }
        req.end();
    });
};

// Function to get the authentication token
const getAuthToken = async () => {
    console.log('Authenticating with Flaticon API...');
    const url = new URL(`${BASE_URL}/app/authentication`);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
    };
    const body = `apikey=${API_KEY}`;

    try {
        const response = await makeRequest(url, options, body);
        console.log('Authentication successful!');
        return response.data.token;
    } catch (error) {
        console.error('Error getting auth token:', error.message);
        throw error;
    }
};

// Function to search for an icon
const searchIcon = async (token, term) => {
    console.log(`Searching for: ${term}`);
    const encodedTerm = encodeURIComponent(term);
    const url = `${BASE_URL}/search/icons?q=${encodedTerm}&styleShape=lineal-color&limit=1`;
    const options = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        const response = await makeRequest(url, options);
        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        console.warn(`No icon found for "${term}"`);
        return null;
    } catch (error) {
        console.error(`Error searching for "${term}":`, error.message);
        return null;
    }
};

// Function to download an image
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Downloaded: ${filepath}`);
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download ${url}. Status: ${res.statusCode}`));
            }
        }).on('error', (e) => {
            reject(e);
        });
    });
};


// --- Main Execution ---
const main = async () => {
    let token;
    try {
        token = await getAuthToken();
    } catch (error) {
        console.error('Could not authenticate. Aborting script.');
        return;
    }

    for (const category in categories) {
        const words = categories[category];
        const dir = path.join(__dirname, 'project', 'public', 'images', 'classroom', category);
        
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        for (const word of words) {
            const icon = await searchIcon(token, word);
            if (icon) {
                const imageUrl = icon.images['512'];
                const filepath = path.join(dir, `${word}.png`);
                try {
                    await downloadImage(imageUrl, filepath);
                } catch (error) {
                    console.error(`Failed to download icon for "${word}":`, error.message);
                }
            }
        }
    }

    console.log('\nIcon download process complete!');
};

main(); 