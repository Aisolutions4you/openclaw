const express = require('express');
const app = express();
const indexRoutes = require('./routes/index');
const aiRoutes = require('./routes/ai');

// Middleware
app.use(express.json());

// Routes
app.use('/', indexRoutes);
app.use('/ai', aiRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});