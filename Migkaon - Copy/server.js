const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Connect to SQLite database
const dbPath = path.join(__dirname, 'database', 'recipes.db');
const db = new sqlite3.Database(dbPath);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route handler for adding a new recipe
app.post('/addRecipe', upload.single('image'), (req, res) => {
    const { recipeName, ingredients, instructions } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validate inputs
    if (!recipeName || !ingredients || !instructions) {
        return res.status(400).json({ error: 'Please provide all fields: recipeName, ingredients, instructions' });
    }

    // Insert into SQLite database
    const sql = `INSERT INTO recipes (name, ingredients, instructions, image) VALUES (?, ?, ?, ?)`;
    db.run(sql, [recipeName, ingredients, instructions, image], function(err) {
        if (err) {
            console.error('Error adding recipe:', err.message);
            return res.status(500).json({ error: 'Failed to add recipe' });
        }
        console.log(`Recipe added with ID: ${this.lastID}`);
        res.status(200).send('Recipe added successfully');
    });
});

// Route handler for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
