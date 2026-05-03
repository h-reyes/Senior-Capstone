const path = require('path');
const express = require('express');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(pageRoutes);
app.use(authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
