import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import fs from 'fs';


async function init() {
  const db = await open({
    filename: './database/files.sqlite',
    driver: sqlite3.Database,
  });
  console.log('Connected to the SQLite database.');
  await db.migrate({ migrationsPath: './database/sqlite' });
  return db;
}

const dbCon = init();

export async function getID() {
  const db = await dbCon;
  return db.all('SELECT * FROM files');
}

// export async function getID() {
  // const db = await dbCon;
  // let data = {};
  // const files = await db.all('SELECT * FROM files', []);
  // files.forEach((file) => {
  //   console.log(file);
  // });

  // await db.all('SELECT * FROM files', [], async (err, rows) => {
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   } else {
  //     await rows.forEach((row) => {
  //       console.log('row:', row);
  //       data = row;
  //       return row;
  //     });
  //   }
  // });
  // console.log(data);
// }
