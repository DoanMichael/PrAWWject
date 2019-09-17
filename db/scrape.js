let db = require('./gifInterface.js');
let axios = require('axios');
let mysql = require('mysql');

//---Useful Vars---
const dbHost = 'localhost';
const dbUser = 'root';
const dbPasswd = 'reallysuperdupersecurepassword';
const dbName = 'gifdb'

// Sends an HTTP GET request to the Giphy API
// and returns the specified number of gifs from
// a query on the given search string.
// @param: search_str   The string to search Giphy with
// @param: num_gifs     The number of gifs to return
// @return: An array containing the full, parsed JSON object for each gif
function gifRequest(tags, num_gifs) {
    console.log("Sending request to Giphy API...")
    // This is the api key registered to Giphy for our application. All Giphy requests must include it
    const api_key = 'krsKlTlR33rpdgFxenImHRzXk6Sxf0UR';
  
    // Initialize blank string and add each element from tags[] to create the search string
    var search_str = '';
    for (i = 0; i < tags.length; i++) {
      search_str += tags[i];
      if (i != tags.length - 1) search_str += '+';
    }
  
    axios.get('https://api.giphy.com/v1/gifs/search?q='+search_str+'&api_key='+api_key+'&limit='+num_gifs)
      .then(resp => {
        console.log("Success! Retrieved "+num_gifs+" gif URLs from Giphy.");
        // Send the parsed JSON object to the callback
        saveGifs(resp.data.data, tags);
      })
      .catch(error => {
        console.error(error);
      });
  }

// Stores gif data from the Giphy API call in the database.
// @param: data   The array containing fetched gif data
function saveGifs(data, tags) {
    // Create an array of URLs to store in the database
    let values = [];
    for (i=0; i<data.length; i++) {
      values.push(data[i].images.original.url);
    }
  
    // Initialize connection with the right parameters
    var con = mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPasswd,
      database: dbName
    });
  
  
    // Connect to the database and run INSERT query
    con.connect(err => {
      if (err) throw err;
  
      // Get TagIDs
      var tagIDs = '';
      con.query('SELECT TagID FROM tags WHERE Name in (?)', [tags], (err, result) => {
        if (err) {
          console.error('ERROR while retrieving tag IDs.');
          console.error(err);
        }
        for (i=0; i<result.length; i++) {
          tagIDs += result[i].TagID + '';
          if (i != result.length-1) tagIDs += ','
        }
      });
  
      // Remove duplicate gifs
      con.query('SELECT URL FROM gifs WHERE URL in (?)', [values], (err, result) => {
        if (err) {
          console.log('ERROR while retrieving duplicate gifs.');
          console.error(err);
        } 
  
        for (i=0; i<result.length; i++) {
          let idx = values.indexOf(result[i].URL);
          if (idx != -1) {
            values.splice(idx, 1);
          }
        }
  
        // We must run the insert within the callback from the query which finds duplicates
        // because we need the updated values list in order to insert
        // Run the INSERT query with the array of URLs created above
        let qstr = "INSERT INTO Gifs (URL, TagIDs) VALUES (?)";
        var rowCount = 0;
        var gifIDs = [];
        for (j=0; j<values.length; j++) {
          let vals = [values[j], tagIDs];
          con.query(qstr, [vals], (err, result) => {
            if (err) {
              console.log(this.sql);
              console.error('ERROR inserting gifs');
              console.error(err);
            }
            gifIDs.push(result.insertId);
            rowCount++;
          });
        }
    
        // Disconnect from the database
        con.end();
      });
    });
  }

module.exports.gifRequest = gifRequest;
  
// Uncomment to run a request to Giphy
/*let tags = ['cute', 'dog'];
let num_gifs = 5;
gifRequest(tags, num_gifs);*/