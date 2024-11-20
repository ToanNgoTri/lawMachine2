/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
var admin = require('firebase-admin');
// const functions = require('firebase-functions');
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
const { MongoClient } = require("mongodb");

var serviceAccount = require('./project2-197c0-firebase-adminsdk-wgo9a-4a0448ab63.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://project2-197c0-default-rtdb.firebaseio.com',
});

const client = new MongoClient(
    "mongodb+srv://gusteixeira25:JPwO1gvfCAjiuXKo@testdatabase.moky4.mongodb.net/"
  );

  exports.searchLaw = onRequest(async (req, res) => {
    try {
        const database = client.db("LawMachine");
        const LawContent = database.collection("LawContent");
    
        LawContent.find({
          $or: [
            { _id: new RegExp(`${req.query.input}`, "i") },
            { "info.lawDescription": new RegExp(`${req.query.input}`, "i") },
            { "info.lawNameDisplay": new RegExp(`${req.query.input}`, "i") },
          ],
        })
          .project({ info: 1 })
          .sort({ "info.lawDaySign": -1 })
          .toArray()
          .then((o) => res.json(o));
      } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
    //   res.json({34:'ỷtyrtyrtr'})
    
});


exports.searchContent = onRequest(async (req, res) => {
    try {
        const database = client.db("LawMachine");
        const LawSearch = database.collection("LawSearch");
        LawSearch.find({ "fullText": new RegExp(`${req.query.input}`, "i") }).collation({ locale: 'vi' })
          .project({ info: 1 })
          .toArray()
          .then((o) => res.json(o));
      } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
    });
