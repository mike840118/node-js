let express = require('express');

let app = express();

app.set('view engine', 'ejs');
//middleware
app.use(express.urlencoded({extended : false}));
//或者 
app.use(express.json());

app.get('/sales-json', (req, res)=>{
    const sales = require(__dirname + '/../data/sales');
    //res.json(data[2]);
    res.render('sales-json', { sales })
});

app.get('/', (req, res)=>{
    res.render('main', {name: 'Shin'});
});
app.get('/try-qs',  (req, res)=> {
   
    res.json(req.query);
})
app.get('/try-post-from', (req,res) =>{
    // req.body.haha("shine")
    res.render('try-post-from')
});
app.post('/try-post-from', (req,res) =>{
    
    res.render('try-post-from',req.body)
});

app.post('/try-json-post', (req, res)=>{
    req.body.haha = 'shin';
    req.body.contentType = req.get('Content-Type'); // 取得檔頭

    res.json(req.body);
})

app.get('/pending', (req, res)=>{

});
app.get('/ok', (req, res)=>{
    res.send('ok');
});

// app.get('/a.html', (req, res)=>{
//     res.send('from route');
// });

app.use(express.static('public'));

app.use((req, res)=>{
    res.status(404)
    res.send(`
    <h2>找不到你要的頁面</h2>
    <h3>...</h3>
    `)
})


app.listen(3000, ()=>{
    console.log('server started')
})