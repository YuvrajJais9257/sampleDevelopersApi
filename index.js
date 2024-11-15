const express = require('express');
const app = express();
const port = 3005;
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// GET endpoint to retrieve developers data from db.json
app.get('/api/developers', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read data" });
        }
        const dbData = JSON.parse(data);
        res.status(200).json(dbData);
    });
});

// POST endpoint to add a new developer to db.json
app.post('/api/developers', (req, res) => {
    const newDeveloper = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read data" });
        }
        const dbData = JSON.parse(data);
        dbData.developers.push(newDeveloper);

        fs.writeFile(filePath, JSON.stringify(dbData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Unable to save data" });
            }
            res.status(201).json({ message: "Developer added successfully", newDeveloper });
        });
    });
});

app.put('/api/developers/:id', (req, res) => {
    const developerId = req.params.id;
    const updatedDeveloper = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read data" });
        }
        const dbData = JSON.parse(data);
        const developerIndex = dbData.developers.findIndex(developer => developer.id === developerId);

        if (developerIndex === -1) {
            return res.status(404).json({ error: "Developer not found" });
        }

        dbData.developers[developerIndex] = updatedDeveloper;

        fs.writeFile(filePath, JSON.stringify(dbData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Unable to save data" });
            }
            res.status(200).json({ message: "Developer updated successfully", updatedDeveloper });
        });
    });
})

app.delete('/api/developers/:id', (req, res) => {
    const developerId = req.params.id;

    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read data" });
        }
        
        let dbData = JSON.parse(data);

        // Filter out the developer with the matching ID
        const developerIndex = dbData.developers.findIndex(dev => dev.id === developerId);
        if (developerIndex === -1) {
            return res.status(404).json({ error: "Developer not found" });
        }
        
        // Remove developer from the array
        dbData.developers.splice(developerIndex, 1);

        // Save the updated data back to db.json
        fs.writeFile(path, JSON.stringify(dbData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Unable to save data" });
            }
            res.status(200).json({ message: "Developer deleted successfully" });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
