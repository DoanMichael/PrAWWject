//---Dependencies---
var mysql = require('mysql');
var fs = require('fs');

//---Useful Vars---
const dbHost = 'localhost';
const dbUser = 'root';
const dbPasswd = 'reallysuperdupersecurepassword';
const dbName = 'gifdb'



//---Functions-------------------------------------------------------

function updateTags(tags, gifs) {
  var gifstr = "";
  for (i = 0; i<gifs.length; i++) {
    gifstr += gifs[i];
    if (i != gifs.length-1)
      gifstr += ",";
  }

  var con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPasswd,
    database: dbName 
  });

  con.connect(err => {
    if (err) throw err;

    var qstr = "SELECT GifIDs FROM Tags WHERE TagID = ?";
    for (i = 0; i<tags.length; i++) {
      con.query(qstr, tags[i], (err, result) => {
        if (err) throw err;

        
      });
   } 
  });
}


// Retrieve a random gif URL from the database.
// @param: callback   The callback function which will recieve the gif URL
function getGif(callback) {
  var con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPasswd,
    database: dbName
  });

  con.connect(err => {
    if (err) throw err;

    let dbSize = 0;
    // Query the database to get the number of gifs currently stored
    con.query('SELECT COUNT(*) AS num FROM gifs', (err, result) => {
      if (err) throw err;
      dbSize = result[0].num

      // Generate a random row number to pull from the database
      let randIdx = Math.floor(Math.random() * dbSize);
      // Query the database to get the gif URL
      let qstr = 'SELECT * FROM gifs LIMIT '+randIdx+',1';
      con.query(qstr, (err, result) => {
        if (err) throw err;

        if (result[0].URL != null) {
          // If the gif has a URL, return that
          callback(result[0].URL, result[0].GifID);
        } else {
          // If the gif doesn't have a URL, it's cached locally,
          // so return its relative path
          callback('gifs/' + result[0].GifID + '.gif', result[0].GifID);
        }

        con.end();
      });
    });

  });
}


// Retrieve a specific gif from the database
// @param id The GifID of the item to retrieve
// @param callback The callback function will recieve the gif URL
function getGifByID(id, callback) {
  // Create connection to database
  var con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPasswd,
    database: dbName
  });

  con.connect(err => {
    if (err) throw err;

    let url = '';
    // Query the database to get the gif with the specified ID
    con.query('SELECT URL FROM gifs WHERE GifID='+id, (err, result) => {
      if (err) throw err;
      url = result[0].URL;
      if (url != null) {
        // If the gif has a URL, return that
        callback(url);
      } else {
        // Otherwise, return the rleative path of the
        // locally cached gif
        callback('gifs/'+id+'.gif');
      }

      con.end();
    });
  });
}


function parseTags(tagfile) {
  // Parse tags file
  var content = fs.readFileSync(tagfile);
  var tags = JSON.parse(content).tags;

  // Connect to database
  var con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPasswd,
    database: dbName 
  });

  con.connect(err => {
    if (err) throw err;
    // Remove duplicate rows
    con.query('SELECT Name FROM tags WHERE Name in (?)', [tags], (err, results) => {
      if (err) throw err;
      for (i=0; i<results.length; i++){
        // Get index of duplicate tag
        let idx = tags.indexOf(results[i].Name);
        // Remove from tag array if it's a duplicate
        if (idx != -1) {
          tags.splice(idx, 1);
        }
      }

      // If there are still unique tags, insert those
      if (tags.length != 0) {
        var qstr = 'INSERT INTO tags (Name) VALUES (?)';
        let rowCount = 0;
        for (i=0; i<tags.length; i++) {
          con.query(qstr, tags[i], (err, results) => {
            if (err) throw err;
            rowCount += result.affectedRows;
          });
        }
      // If all tags are duplicates, we're done here
      } else {
        console.log('All tags are duplicates, aborting operation.');
      }

      con.end();
    });
  });
}



function addLike(user, id) {
  let con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPasswd,
    database: dbName
  });

  // Connect to database
  con.connect(err => {
    if (err) throw err;

    // Get current list of gifids
    var rstr = "";
    con.query("SELECT gifid FROM likes WHERE email = ?", user, (err, result) => {
      if (err) throw err;

      rstr = result[0].gifid;
      var gifstr = rstr;
      // Add new id to existing list
      if (gifstr == "") {
        gifstr = id;
      } else if (gifstr.indexOf(id) == -1) {
        gifstr += ","+id;
      } else {
        con.end();
        return;
      }

      // Update database with new likes
      con.query("UPDATE likes SET gifid = ? WHERE email = ?", (gifstr, user), (err, result) => {
        if (err) throw err;

        con.end();
        return;
      });
    });
  });
}


// ---Exports--------------------------------------------------------
module.exports.getGif = getGif;
module.exports.addLike = addLike;
module.exports.getGifById = getGifByID;



// ---Testing-------------------------------------------------------

/*let tags = ['cute', 'dog'];
let num_gifs = 5;
gifRequest(tags, num_gifs);*/

/*let tagIDs = [1, 6];
let gifIDs = [239, 240, 241, 242, 243];
updateTags(tagIDs, gifIDs);*/

/*getGif(url => {
  console.log(url);
});*/

/*
getGifByID(138, url => {
  console.log("found url "+url);
});*/

//parseTags('tags.json');
