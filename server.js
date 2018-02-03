var express = require('express');


var app = express();
app.set('view engine', 'ejs');

/*---------------Index Routing--------------------*/

app.get('/', (req,res)=>{
  res.render('index');
});


app.listen(3000, () =>{ console.log("Server listening on port 3000 !")});
