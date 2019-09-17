var db = require('./gifInterface');
var scraper = require('./scrape.js');
var mysql = require('mysql');

//---Useful Vars---
const dbHost = 'localhost';
const dbUser = 'root';
const dbPasswd = 'reallysuperdupersecurepassword';
const dbName = 'gifdb'

function test_getGif(num_tests) {
    // Track number of passes
    var passes = 0;

    for (i=0; i<num_tests; i++) {
        db.getGif((url, id) => {
            let url_pass = (url != null);
            let id_pass = (id != null);

            if (url_pass || id_pass) 
                passes++;
    
            console.log("URL: "+url);
            console.log("URL passed: "+url_pass);
            console.log("ID: "+id);
            console.log("ID passed: "+id_pass);
            console.log("--------------------");
            console.log(passes+" of "+num_tests+" tests passed so far");
        });
    }
}

function test_getGifById(ids, urls) {
    let num_gifs = ids.length;
    var resp = [];

    for (i=0; i<num_gifs; i++) {
        db.getGifById(ids[i], url => {
            resp.push(url);
        });
    }

   setTimeout(() => {
    let passes = 0;
    let num_gifs = urls.length;

    for (i=0; i<num_gifs; i++) {
        console.log("URL: "+resp[i]);
        console.log(urls[i]);
        if (resp[i] == urls[i]) {
            console.log("PASSED");
            passes++;
        } else {
            console.log("FAILED");
        }
        console.log("-------------------------------------");
        console.log(passes+" of "+num_gifs+" passed so far");
        console.log("-------------------------------------");
    }
   }, 1000);
}

function test_gifRequest() {
    var passes = 0;
    let tags = ['cute', 'kitty'];
    let num_gifs = 5;
    scraper.gifRequest(tags, num_gifs);

    setTimeout(() => {
        var con = mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPasswd,
            database: dbName 
        });
    
        con.connect(err => {
            if (err) throw err;
    
            var maxid = -1;
            var ids = [];
            con.query("SELECT MAX(GifID) as id FROM Gifs", (err, results) => {
                if (err) throw err;
    
                maxid = results[0].id;
                for (i=maxid-4; i<=maxid; i++) {
                    ids.push(i);
                }

                let q = con.query("SELECT * FROM Gifs WHERE GifID IN (?)", [ids], (err, result) => {
                    if (err) throw err;

                    for (i=0; i<ids.length; i++) {
                        console.log("-------------------");
                        console.log("Checking gif "+(i+1));
                        if (result[i].GifID == null) {
                            console.log("FAILED");
                        } else {
                            console.log("PASSED");
                            passes++;
                        }
                        console.log(passes+" of "+num_gifs+" passed so far");
                    }

                    con.end();
                });
            });
        });
    }, 1000);
}



function runTests() {
    /*
    let ids = [327, 328, 329, 330, 331];
    let urls = ['https://media0.giphy.com/media/ctUtYKSfmvJOE/giphy.gif', 'https://media0.giphy.com/media/6MWahPArixa6I/giphy.gif', 'https://media3.giphy.com/media/Z9ZbHtCVrdTB6/giphy.gif', 'https://media1.giphy.com/media/11EEXw1EIEoHaE/giphy.gif', 'https://media0.giphy.com/media/kOEYOwSaKbFra/giphy.gif'];
    test_getGifById(ids, urls);
    console.log();
    */

    /*
    test_gifRequest();
    console.log();
    */

    test_getGif(5);
}

runTests();