let express = require('express');

let app = express();
app.set('view engine', 'ejs');
//middleware
app.use(express.urlencoded({extended : false}));
//或者 
app.use(express.json());

app.get('/json' ,function(req,res){
    const data = require(__dirname + '/../data/sales');
    // res.json(data[2]);
    res.render('sales', {
       sales : data
    });
});

app.get('/', function (req, res) {
    // res.render('sales', {name: 'Shinder'});
    res.send("ok")
})

 
app.get('/try-post-from', (req,res) =>{
    // req.body.haha("shine")
    res.render('try-post-from')
});

app.get('/try-get', (req,res) =>{
    // req.body.haha("shine")
    res.render('try-post-from') 
    // req.body.content=res.get("message")
});


app.post('/try-post-from', (req,res) =>{
    
    res.render('try-post-from',req.body)
});

app.get('/try-qs',  (req, res)=> {
   
    res.json(req.query);
})

app.get('/panding',function(req ,res){
    
})
app.get('/start',function(req ,res){
  res.send("start")
})
// app.get('/a.html',function(req ,res){
//     res.send('Hello World!!!!!!');
// })

// 放在路由器設定的前面
app.use(express.static('public'));

app.listen(3000,()=>{
    console.log("Start!!")
})



app.use((req , res)=> {
    res.type('text/plain');
    res.status(404);
    res.send(`404 - 找不到網頁`)
})