const express = require('express')
const app = express()
const readingsRouter = require("./routes/readings.routes");
const dotenv = require('dotenv')
dotenv.config()

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type');
    res.header('Content-Type', 'application/json');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.get('/', function(req, res) {
    res.send('All Good');
})

readingsRouter.routesConfig(app);
app.listen(process.env.PORT, () => console.log(`App is listening port ${process.env.PORT}`))