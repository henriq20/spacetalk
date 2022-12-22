import './config.js';
import express from 'express';
import routes from './routes.js';

const app = express();

app.use(express.json());
app.use('/api', routes);

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${ process.env.PORT }`);
});
