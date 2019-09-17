app.get('/', function (req, res){

  req.getConnection(function(error, conn){
    var SongID = (math.floor(math.random() * 12)+1);
  conn.connect(function(err){
    if (err) throw err;
      conn.query('SELECT '+SongID+ ' FROM musicdb', function (err, result, fields) {
        if (err) throw err;
          console.log(result);
  }
}