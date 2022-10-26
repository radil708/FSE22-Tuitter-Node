"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Implements an Express Node HTTP server.
 */
const express = require("express");
const app = express();
app.use(express.json()); // Allows server to parse data coming from clients
function sayHello(req, res) {
    res.send('Hi from FSD!');
}
function defaultPage(req, res) {
    res.send('Welcome to Ramzi\'s FS22 SoftEng AWS server');
}
app.get('/', defaultPage);
app.get('/hello', sayHello);
/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku/AWS if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
//# sourceMappingURL=server.js.map