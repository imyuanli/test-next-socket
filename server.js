// const express = require('express');
// const next = require('next');
//
// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();
//
// app.prepare().then(() => {
//   const server = express();
//
//   server.get('/api/hello', (req, res) => {
//     res.json({ message: 'Hello from Express!' });
//   });
//
//   server.get('*', (req, res) => {
//     return handle(req, res);
//   });
//
//   server.listen(3001, (err) => {
//     if (err) throw err;
//     console.log('> Ready on http://localhost:3001');
//   });
// });

//expresss
const express = require('express');
const next = require('next');
const http = require('http');
const socketIO = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIO(httpServer);
// 存储待办事项列表 那我就要问你给问题了 1你觉得js最难的知识点是啥 有个人说是原型链 ？还好吧其实还是promise怎么说
//   promise 多jb难操，原型链还是比较好理解的   操 这样能智能出来？你是不是想说这句话1害怕 别慌 你说你觉得js最难的知识点是啥
  var todoList = [
    'a',
    'b',
    'c',
    'd',
  ];
// 监听客户端连接事件
  io.on('connection', function (socket) {
    // 发送待办事项列表给新连接的客户端
    socket.emit('todoList', todoList);

    // 监听客户端发送的添加待办事项事件
    socket.on('addTodo', function (newTodo) {
      todoList.push(newTodo);
      // 广播新的待办事项给所有客户端
      io.emit('todoList', todoList);
    });
    socket.on('deleteTodo', function (index) {
      console.log(index)
      todoList.splice(index, 1);
      // 广播新的待办事项给所有客户端
      io.emit('todoList', todoList);
    });


  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});