
import * as db from './database/database.js';
import express from 'express';
import multer from 'multer';
import fs from 'fs';

// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');

// const config = require('./config.json');

// const configuredMulter = multer(config);
// const single = configuredMulter.single('test');
const app = express();
app.use(express.static('src', { extensions: ['html'] }));

const uploader = multer({
  dest: 'uploads',
});

async function upload(req, res) {
  const content = await req.file;
  console.log(content);
  const data = fs.readFileSync(content.path, 'utf8');
  res.json(data);
}

async function getAll(req, res) {
  // console.log(await db.getID());
  res.json(await db.getID());
}

function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

// app.get('/test', express.json(), asyncWrap(getTest));
app.post('/upload', express.json(), asyncWrap(upload));
app.get('/getData', asyncWrap(getAll));

console.log('Running');
app.listen(8080);
