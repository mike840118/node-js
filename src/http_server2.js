const http = require('http'),
      fs   = require('fs');
const server =http.createServer((req,res) =>{
    fs.writeFile(__dirname+'/header.js',
    JSON.stringify(req.headers),
    error =>{
        if(error){
            console.log(error);
        }
       else{res.end(`ok`)}
    });
})
server.listen(3000);