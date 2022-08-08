
// constants
const PORT = 8080;

// dependencies
import express from 'express';
import routes from './routes/routes.js';
import applyfee from './routes/applyfee.js'

// initiating the rest api
const app = express();

// middlewares
app.use(express.json());

// initialize routes
app.use('/', routes, applyfee);

// starting our server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})

// THANK YOU FOR USING API