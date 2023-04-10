const express = require('express');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const url = require('url');
const jwt = require('jsonwebtoken');
var cors = require('cors');
const port = 3000;
const jwtSecret = "gobang-secret";


const app = express();
const expressServer = app.listen(port, () => {
    console.log("Express server listening at http://localhost:" + port);
});
const wss = new WebSocketServer({ server: expressServer, path: '/ws' });

// app.use(cors({
//     origin: 'http://localhost:8081/'
// }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('public'));
app.get('/auth', (req, res) => {
    res.send(fetchUserToken(req));
});


const userCredentials = new Map();

const fetchUserToken = (req) => {
    let token = jwt.sign(
        {
            // "sub": userCredentials[i].userId,
            "userid": req.query.userid
        },
        jwtSecret,
        { expiresIn: 900 } // Expire the token after 15 minutes.
    );
    if (!userCredentials.has(req.query.userid)) {
        userCredentials.set(req.query.userid, token);
    }
    return token;
    //     if (userCredentials[i].userId == req.query.userid) {
    //         // 将query参数中的username与数据库进行比对，签发token
    //         return jwt.sign(
    //             {
    //                 // "sub": userCredentials[i].userId,
    //                 "userid": req.query.userid
    //             },
    //             jwtSecret,
    //             { expiresIn: 900 } // Expire the token after 15 minutes.
    //         );
    //     }
    // }
    // return "Error: No matching user credentials found.";
}

var players = [];

function wsSend(pid, content) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].pid != pid) {  //若pid不匹配则发送，即发给另一位玩家而非自己
            let clientSocket = players[i].ws;
            console.log('send-->', players[i].pid)
            if (clientSocket.readyState == WebSocket.OPEN) {
                clientSocket.send(JSON.stringify(content));
            }
        }
    }
}

// Handle the WebSocket `connection` event. This checks the request URL
// for a JWT. If the JWT can be verified, the client's connection is added;
// otherwise, the connection is closed.
wss.on('connection', (ws, req) => {
    var token = url.parse(req.url, true).query.token;

    // var wsUserid = "";

    // 经token校验获取包含的id信息
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            ws.close();
        } else {
            players.push({ "pid": decoded.userid, "ws": ws }); //记录连接上的玩家信息，客户端发送的pid不可相同
            console.log(`client ${decoded.userid} has connected`);
        }
    });
    // Handle the WebSocket `message` event. If any of the clients has a token
    // that is no longer valid, send an error message and close the client's
    // connection.
    ws.on('message', (message) => {
        let msg = JSON.parse(message);
        var msgtype = msg.type;
        var pid = msg.pid; //客户端每次需发送自己的pid
        // var pointX = msg.pointX;
        // var pointY = msg.pointY;
        // var order = msg.order;

        switch (msgtype) {
            case "drop":
                wsSend(pid, msg);  //将一位玩家发来的消息原封不动发给另一位玩家
                break;
            case "back":
                wsSend(pid, msg);  //将一位玩家发来的消息原封不动发给另一位玩家
                break;
        }

    });
});