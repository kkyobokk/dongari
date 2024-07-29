const express = require('express');
const cors = require('cors');

const app = express();

let corsOptions = {
    origin: 'https://www.domain.com',
    credentials: true
}

app.use(cors(corsOptions));



app.listen(8080, () => {
    console.log("Server is Listening");
})