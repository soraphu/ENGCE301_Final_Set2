require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { initDB } = require('./db/db');
const profileRoutes = require('./routes/profile');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/profiles', authMiddleware, profileRoutes);

// Special case: health check should be public for Railway/Docker
app.get('/api/profiles/health', (_, res) => res.json({ status: 'ok', service: 'user-service' }));

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

async function start() {
    let retries = 5;
    while (retries > 0) {
        try {
            await initDB();
            break;
        } catch (err) {
            console.log(`[user-service] Waiting for DB... (${retries} retries left)`);
            retries--;
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    app.listen(PORT, () => {
        console.log(`[user-service] Running on port ${PORT}`);
    });
}

start();
