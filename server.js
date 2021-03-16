const express = require('express');
const multer = require('multer');
const config = require('./config.json');

const configuredMulter = multer(config);
const single = configuredMulter.single('test');

async function upload(req, res) {
  // const response = {
  //     name: req.file.originalname,
  //     content: req.file.text
  // }
  const response = 'working as usual';
  res.json(response);
  console.log('Processing - backend');
}


const app = express();

app.use(express.text);
app.use('/', express.static('src'));
app.post('/upload', single, upload);

console.log('Running');
app.listen(5500);
