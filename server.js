const express = require('express');
const multer = require('multer');
const fs = require('fs');
// const config = require('./config.json');

// const configuredMulter = multer(config);
// const single = configuredMulter.single('test');
const app = express();
app.use(express.static('src', { extensions: ['html'] }));

const uploader = multer({
  dest: 'upload',
});

async function upload(req, res) {
  const content = await req.file;
  console.log(content);
  const data = fs.readFileSync(content.path, 'utf8');
  res.json(data);
}

// async function getTest(req, res) {
//   const msg = { test: 'test' };
//   res.json(msg);
// }

function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

// app.get('/test', express.json(), asyncWrap(getTest));
app.post('/upload', uploader.single('file'), express.json(), asyncWrap(upload));

console.log('Running');
app.listen(5500);
