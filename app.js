const express = require('express');
const fs = require('fs'); 
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());

app.get('/api/airports', (req, res) => {
    const { query } = req;
    const userInput = query.name ? query.name.toLowerCase() : '';

    const filePath = path.join(__dirname, 'data', 'airports.json');
    console.log(`Looking for airport data at: ${filePath}`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading airport data:', err);
            return res.status(500).send('Server error');
        }
        try {
            const airportList = JSON.parse(data);

            const filteredAirports = airportList.filter(airport => 
                (airport.name && airport.name.toLowerCase().includes(userInput)) ||
                (airport.city && airport.city.toLowerCase().includes(userInput)) ||
                (airport.state && airport.state.toLowerCase().includes(userInput))
            ).map(airport => ({
                name: capitalize(airport.name),
                city: airport.city ? capitalize(airport.city) : 'N/A',
                state: airport.state ? capitalize(airport.state) : 'N/A',
            }));

            res.json(filteredAirports);
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            console.error('Data received:', data);
            res.status(500).send('Server error');
        }
    });
});

function capitalize(str) {
    return str ? str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '';
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
