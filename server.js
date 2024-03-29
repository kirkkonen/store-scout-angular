const express = require('express');

const app = express();

app.use(express.static('./dist/store-scout-angular/'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/store-scout-angular/'}),
);

app.listen(process.env.PORT || 8080);