/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
var admin = require("firebase-admin");
// const functions = require('firebase-functions');
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

var serviceAccount = require("./project2-197c0-firebase-adminsdk-wgo9a-4a0448ab63.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project2-197c0-default-rtdb.firebaseio.com"
});

exports.searchLawFunction = onRequest( async(req, res) => {  
    const db = admin.database();

    let LawInfo 
    const ref = await db.ref(`/LawInfo`).once("value", function(snapshot) {
      LawInfo = snapshot.val()
      
    })
  
  let input = req.query.input
  
  let lawFilterName  
  
  let LawFilterFull = {}
  if(Object.keys(LawInfo).length){
    lawFilterName= Object.keys(LawInfo).filter( (key)=>{
      
  return LawInfo[key]['lawDescription'].match(new RegExp(`${input}`, "gim"))   || LawInfo[key]['lawNumber'].match(new RegExp(`${input}`, "gim")) || LawInfo[key]['lawNameDisplay'].match(new RegExp(`${input}`, "gim"))
  // console.log("key['lawDescription']",key['lawDescription']);
  
  })
  
  lawFilterName.map( key =>{
    LawFilterFull[key] = LawInfo[key]
  })
  
  }
   
  res.send(LawFilterFull)
    });

    function Search(data,input) {
        let searchArray = {};
      
        if (input) {
          if (input.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {
      
            function a(key, key1) {
              // key ở đây là tên luật, key1 là Object 1 chương
      
              Object.values(key1)[0].map((key2, i1) => {
                // chọn từng điều
      
                let replace = `(.*)${input}(.*)`;
                let re = new RegExp(replace, 'gmi');
                let article = Object.keys(key2)[0].replace(/(?<=\w*)\\(?=\w*)/gim, '/')
                let point = Object.values(key2)[0].replace(/(?<=\w*)\\(?=\w*)/gim, '/')
      
                if (Object.keys(key2)[0].match(re)) {
                  searchArray[key].push({
                    [article]: point,
                  });
                } else if (point != '') {
                  if (point.match(re)) {
                    searchArray[key].push({
                      [article]: point,
                    });
                  }
                }
              });
      
              
            }
      
            Object.keys(data).map(
              (key, i) => {
                // key là tên luật
                //key là tên của luật
                // tham nhap luat (array chuong)
      
                searchArray[key] = [];
                  data[key].map(
                    (key1, i1) => {
                      // ra Object Chuong hoặc (array phần thứ...)
                      if (Object.keys(key1)[0].match(/^phần thứ .*/gim)) {
                        // nếu có 'phần thứ
                        // console.log('phần thứ');
                        // console.log('Object.keys(key1)[0]',Object.keys(key1)[0]);
                        if (
                          Object.keys(Object.values(key1)[0][0])[0].match(
                            /^Chương .*/gim,
                          )
                        ) {
                          //nếu có chương trong phần thứ
      
                          Object.values(key1)[0].map((key2, i) => {
                            a(key, key2);
                          });
                        } else {
                          //nếu không có chương trong phần thứ
                          a(key, key1);
                        }
                      } else if (Object.keys(key1)[0].match(/^chương .*/gim)) {
                        a(key, key1);
                      } else {
                        //nếu chỉ có điều
                        if(i1==0){ //  đảm bảo chỉ chạy 1 lần
                          a(key, {
                            'chương Giả định':
                              data[key],
                          });
      
                        }
                      }
                    },
                  );
              },
            );
      
            let searchResult = {};
      
            Object.keys(searchArray).map((key, i) => {
              searchArray[key].map((key1, i) => {
                searchResult[key] = searchArray[key];
              });
            });
      return searchResult
            // console.log('searchResult',searchResult);
          } else {
          }
        } else {
        }
      }
      

      exports.searchContentFunction = onRequest( async(req, res) => {  
        const db = admin.database();

        let LawContent = {}
        const ref = await db.ref(`/LawContent`).once("value", function(snapshot) {
          LawContent = snapshot.val()
        })
      
        let LawInfo = {}
        const inf = await db.ref(`/LawInfo`).once("value", function(snapshot) {
          LawInfo = snapshot.val()
        })
      
      
      let input = req.query.input
      
      let result = Search(LawContent,input)
      
      // console.log('result',result);
      
      res.send({'LawContent':result,'LawInfo':LawInfo})
              });
    