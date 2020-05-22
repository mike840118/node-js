let express = require('express');
// const multer = require('multer');
// const upload = multer({dest: 'tmp_uploads/'})
const upload = require(__dirname + '/upload-module');


const moment = require('moment-timezone');
const fs = require('fs');
const app = express();


app.set('view engine', 'ejs');
//middleware
app.use(express.urlencoded({extended : false}));
const session = require ('express-session');
app.use(session({
    // 新用戶沒有使用到 session 物件時不會建立 session 和發送 cookie
    saveUninitialized:false,
    resave:false,// 沒變更內容是否強制回存
    secret:'121huaijnkslajjfkadljgal;kjdg;md;c',//加密文字
    cookie:{
        maxAge:1200000,//20分鐘，毫秒
    }
}));
//或者 
app.use(express.json());
//另外一個middleware
app.use((req,res ,next)=>{
    res.locals.memberData={
        name:'shin',
        action:'edit'
    }
    next();
});
//登入的middleware
app.use((req,res,next)=>{
    res.locals.sess=req.session ||{}
    next();
})

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

// app.post('/try-upload', upload.single('avatar'), (req, res)=>{
    
//     const output = {
//         success: false,
//         uploadedImg: '',
//         nickname: '',
//         errorMsg: ''
//     }
//     output.nickname = req.body.nickname || '';
//     if(req.file && req.file.originalname){
//         switch(req.file.mimetype){
//             case 'image/png':
//             case 'image/jpeg':
//                 fs.rename(req.file.path, './public/img/'+ req.file.originalname, error=>{
//                     if(!error){
//                         output.success = true;
//                         output.uploadedImg = '/img/' + req.file.originalname;
//                     }
//                     res.render('try-upload', output);
//                 })
//                 break;
//             default:
//                 fs.unlink(req.file.path, error=>{
//                     output.errorMsg = '檔案類型錯誤'
//                     res.render('try-upload', output);
//                 })
//         }
//     }
// });
//  組合的方式----
// const func =
//  (req, res)=>{
//     res.json({
//         filename: req.file.filename,
//         body: req.body
//     });
// }
app.post('/try-upload2', upload.single('avatar'), (req, res)=>{
    res.json({
        filename: req.file.filename,
        body: req.body
        
    });
})

// app.get('/my-params1/:action/:id', (req, res)=>{
//      res.json(req.params);
// });

// app.get('/my-params1/:action?/:id?', (req, res)=>{
//     res.json(req.params);
// });

// app.get('/my-params1/*/*?', (req, res)=>{
//      res.json(req.params);
// });

app.get(/^\/mobile\/09\d{2}-?\d{3}-?\d{3}$/, (req, res) =>{
    let url = req.url.slice(8).split('?')[0];
    url= url.split('-').join('');
    res.send('Mobile : ' + url);
    // req.body.haha("shine")
    
});
// const admin2Router = require(__dirname + '/admins/admin2');
app.use('/my/', require(__dirname + '/admins/admin2'));

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
app.get('/login',(req,res)=>{
res.render('login')
})
app.post('/login', upload.none(), (req, res)=> {
    const users = {
        'shin' : {
            pass: '12345',
            nick: '小新'
        },
        'ming' : {
            pass: '5678',
            nick: '小明'
        },
    };

    const output = {
        success: false,
        body: req.body
    };

    if(users[req.body.account] && users[req.body.account].pass===req.body.password){
        output.success = true;
        req.session.user = {
            id: req.body.account,
            nickname: users[req.body.account].nick,
        }
    }
    output.sess_user = req.session.user;

    res.json(output);
});

app.get('/logout',(req,res)=>{
    delete req.session.user;
    res.redirect('/login');
    })
// app.get('/a.html', (req, res)=>{
//     res.send('from route');
// });
// 時間格式化輸出
app.get('/try-moment',(req,res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m1 = moment(new Date());
    const m2 = moment(req.session.cookie.expires);
    const m3 = moment('2019-01-10')
    res.json({
        m1:m1.format(fm),
        m2:m2.format(fm),
        m3:m3.format(fm),
        m4:m1.tz('Europe/London').format(fm),
        m5:m2.tz('Europe/London').format(fm),
        m6:m3.tz('Europe/London').format(fm),
    })
});

app.use('/address-book', require(__dirname+'/address_book'));

app.get('/try-session',(req,res)=>{
    req.session.my_var=req.session.my_var||0;
    req.session.my_var++
    res.json({
        my_var:req.session.my_var,
        session:req.session
    })
})

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