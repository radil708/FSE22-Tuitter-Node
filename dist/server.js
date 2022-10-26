"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.get('/', (req, res) => res.send('Welcome WebDev!'));
const PORT = 3000;
app.listen(process.env.PORT || PORT);
//# sourceMappingURL=server.js.map