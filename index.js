const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const nodemailer = require('nodemailer');
const multiparty = require('multiparty');
require('dotenv').config();

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/todo', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/todo/todo-list.html'));
});

const transporter = nodemailer.createTransport({
	host: 'smtp-mail.outlook.com',
	port: 587,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASS
	}
});

transporter.verify(function(error, success) {
	if (error) {
		console.log(error);
	} else {
		console.log('Ready to take on messages');
	}
});

app.post("/send", (req, res) => {
  //1.
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

    //2. You can configure the object however you want
    const mail = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Inquiry From Portfolio Website",
      text: `Message sent from ${data.name} \nEmail: <${data.email}> \nMessage: \n${data.message}`,
    };

    //3.
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong." });
      } else {
        return res.status(200).json({ message: "Email successfully sent."});
      }
    });
  });
});


app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});