const http = require('http');

// создаём сервер
// передадим обработчик
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf8'
    });
    // в методе end тоже можно передать данные
    res.end('<h1>Привет, мир!</h1>', 'utf8');
});

server.listen(3000); // будем принимать сообщения с 3000 порта
console.log('In Node We Trust'); 