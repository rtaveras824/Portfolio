const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/todo', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/todo/todo-list.html'));
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})