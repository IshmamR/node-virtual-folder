const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// built in modules
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({"origin": "*"})); // CORS 



// Connect to mongodb
const dbURI = `mongodb+srv://ishmam:${process.env.MONGO_PASS}@ishita.oa6bd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
// 	.then(result => listenServer())
// 	.catch(error => console.log(error));


// Front page for documentations and testing
app.get('/', (req, res) => {
	res.status(200);
	fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
})

// ROUTES
const folderRoute = require('./routers/folderRouters/folderRoute.js');
app.use('/folders', folderRoute);



// PORT for the server
function listenServer() {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`app is listenig on PORT:${PORT}`)
	})
}
listenServer();