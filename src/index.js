let express = require('express');

let app = express();

app.get('/',function(req ,res){
    res.send('Hello World!!');
})

app.get('/panding',function(req ,res){
    
})
app.get('/start',function(req ,res){
  req.send("/start")
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