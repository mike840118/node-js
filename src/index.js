let express = require('express');
const multer = require('multer');
const upload = multer({dest: 'tmp_uploads/'})
const fs = require('fs');
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
app.get('/try-upload', (req, res)=>{
    res.render('try-upload');
})

app.post('/try-upload', upload.single('avatar'), (req, res)=>{
    
    const output = {
        success: false,
        uploadedImg: '',
        nickname: '',
        errorMsg: ''
    }
    output.nickname = req.body.nickname || '';
    if(req.file && req.file.originalname){
        switch(req.file.mimetype){
            case 'image/png':
            case 'image/jpeg':
                fs.rename(req.file.path, './public/img/'+ req.file.originalname, error=>{
                    if(!error){
                        output.success = true;
                        output.uploadedImg = '/img/' + req.file.originalname;
                    }
                    res.render('try-upload', output);
                })
                break;
            default:
                fs.unlink(req.file.path, error=>{
                    output.errorMsg = '檔案類型錯誤'
                    res.render('try-upload', output);
                })
        }
    }
});
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