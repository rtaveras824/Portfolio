const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('index.html');
});

app.get('/todo', (req, res) => {
	res.send('todo/todo-list.html');
});

app.get('/todo-list', (req, res) => {
	res.send('todo-list.html');
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})