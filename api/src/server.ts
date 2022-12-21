import './config.js';
import express from 'express';

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${ process.env.PORT }`);
});
