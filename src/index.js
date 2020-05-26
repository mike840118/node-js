const express = require('express');
// const multer = require('multer');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname + '/db_connect2');
const moment = require('moment-timezone');

const fs = require('fs');
// const upload = multer({dest: 'tmp_uploads/'})
const upload = require(__dirname + '/upload-module');


const app = express();

app.set('view engine', 'ejs');

// top-level middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
const sessionStore = new MysqlStore({}, db);
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'dolkidf;lalsdfjls',
    store:sessionStore,
    cookie:{
        maxAge: 1200000
    }
}));
app.use((req, res, next)=>{

    res.locals.sess = req.session || {};

    // res.locals.customData = {
    //     name: 'shin',
    //     action: 'edit'
    // }
    next();
});


app.get('/', (req, res)=>{
    res.render('main', {name: 'Shin', pageTitle: '小新的網站'});
});

app.get('/sales-json', (req, res)=>{
    const sales = require(__dirname + '/../data/sales');
    //res.json(data[2]);
    res.render('sales-json', { sales })
});

app.get('/try-qs', (req, res)=>{
    console.log(req)
    res.json(req.query);
})

app.get('/try-post-form', (req, res)=>{
    res.render('try-post-form', {pageTitle: '測試表單'})
})

app.post('/try-post-form', (req, res)=>{
    // req.body.haha = 'shin';
    res.locals.pageTitle = '測試表單- posted'
    res.render('try-post-form', req.body)
})

app.post('/try-json-post', (req, res)=>{
    req.body.haha = 'shin';
    req.body.contentType = req.get('Content-Type'); // 取得檔頭

    res.json(req.body);
})

app.get('/pending', (req, res)=>{});
app.get('/ok', (req, res)=>{
    res.send('ok');
});

app.get('/try-upload', (req, res)=>{
    res.render('try-upload');
})
/*
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
*/

app.post('/try-upload2', upload.single('avatar'), (req, res)=>{
    res.json({
        filename: req.file.filename,
        body: req.body
    });
})

app.get('/my-params1/:action?/:id?', (req, res)=>{
    res.json(req.params)
})

app.get(/^\/mobile\/09\d{2}-?\d{3}-?\d{3}$/, (req, res)=>{
    let url = req.url.slice(8).split('?')[0];
    url = url.split('-').join('');

    res.send('Mobile: ' + url)
})

// const admin2Router = require(__dirname + '/admins/admin2');
// app.use(admin2Router);

app.use('/my', require(__dirname + '/admins/admin2') );

app.get('/try-session', (req, res)=>{
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;

    res.json({
        my_var: req.session.my_var,
        session: req.session
    })
})

app.get('/login', (req, res)=> {
    res.render('login');
});
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

app.get('/logout', (req, res)=> {
    delete req.session.user;
    res.redirect('/login');
});

app.get('/try-moment', (req, res)=> {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m1 = moment(new Date());
    const m2 = moment(req.session.cookie.expires);
    const m3 = moment('2019-01-02')

    res.json({
        m1: m1.format(fm),
        m2: m2.format(fm),
        m3: m3.format(fm),
        m1a: m1.tz('Europe/London').format(fm),
        m2a: m2.tz('Europe/London').format(fm),
        m3a: m3.tz('Europe/London').format(fm),
    })

});

app.use('/address-book', require(__dirname+'/address_book'));


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