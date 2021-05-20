
import * as db from './database/database.js';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import ssim from 'string-similarity';

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

  const filename = content.originalname;
  const newfilename = content.filename;

  const response = await db.addFile(filename, newfilename);

  const fileChecker = await checkFilePlag(filename, newfilename, response);
  const lineChecker = await checkLinePlag(filename, newfilename, response);

  const finalChecker = { file: fileChecker, line: lineChecker };

  res.json(finalChecker);
}

async function checkFilePlag(name, filepath, dbfilepath) {
  const similarityData = [];
  const data1 = fs.readFileSync('./uploads/' + filepath, 'utf8');

  await dbfilepath.forEach(file => {
    if (file.filepath !== filepath) {
      const data2 = fs.readFileSync('./uploads/' + file.filepath, 'utf8');
      // console.log(data2.split(/\r?\n/));
      const similar = ssim.compareTwoStrings(data1, data2);
      similarityData.push({ filename1: name, filename2: file.name, similar: similar, type: 'file' });
    }
  });

  // console.log(similarityData);
  return similarityData;
}


async function checkLinePlag(name, filepath, dbfilepath) {
  const similarityData = [];
  let simCounter = 0;

  const data1 = fs.readFileSync('./uploads/' + filepath, 'utf8');
  const lineData1 = data1.split(/\r?\n/);

  await dbfilepath.forEach(file => {
    if (file.filepath !== filepath) {
      const data2 = fs.readFileSync('./uploads/' + file.filepath, 'utf8');
      const lineData2 = data2.split(/\r?\n/);

      for (let i = 0; i < lineData1.length; i++) {
        if (lineData1[i] !== '' && lineData1[i] !== '}') {
          for (let j = 0; j < lineData2.length; j++) {
            if (lineData2[j] !== '' && lineData2[j] !== '}') {
              const lineSim = ssim.compareTwoStrings(lineData1[i], lineData2[j]);
              simCounter += lineSim;
            }
          }
          simCounter = simCounter / lineData2.length;
        }
      }
      similarityData.push({ filename1: name, filename2: file.name, similar: simCounter, type: 'line' });
    }
  });
  return similarityData;
}


async function getAll(req, res) {
  // console.log(await db.getID());
  res.json(await db.getAll());
}

function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

// app.get('/test', express.json(), asyncWrap(getTest));
app.post('/upload', uploader.single('file'), express.json(), asyncWrap(upload));
app.get('/getData', asyncWrap(getAll));

console.log('Running');
app.listen(8080);
