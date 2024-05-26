const http = require('http')
const fs = require('fs')
const path = require('path');

const port = 3000

const server = http.createServer((req, res)=>{
     
     
    res.setHeader('Content-type', 'text/html')

const createPath = (page) => path.resolve(__dirname, 'views', `${page}.html`)

let basePath = '';
switch(req.url){
    case '/':
        basePath = createPath('index')
        res.statusCode = 200;
        break;
        case '/Contact':
            basePath = createPath('contact');
            res.statusCode = 200;
            break;

    case '/about':
        res.statusCode = 301;
        res.setHeader('Location','/Contact')       
        res.end();
    break;
    
    default:
        basePath = createPath('Error');
        res.statusCode = 404;
        break;
}

        fs.readFile(basePath, (err, data)=>{
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.end()
            }else{                
                res.write(data)
                res.end();
            }
        })
    
})

server.listen(port, 'localhost', (error)=>{
    error? console.log(error): console.log("http://localhost:3000/")
})