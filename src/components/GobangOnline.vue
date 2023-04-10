<template>
    <div class="gobang">
        <div class="left">
            <div class="orderInfo">
                <div class="orderWrapper">
                    <div class="order" :class="{ 'player1': blackOrder, 'player2': !blackOrder }"></div>
                    <p>当前回合</p>
                </div>
            </div>
            <textarea cols="30" rows="10" :value="textInfo"></textarea>
        </div>
        <table :disabled="notMyTurn">
            <tr v-for="(row, x) in data.chessBoard" :key="x">
                <td v-for="(value, y) in row" :key="y" @click="drop(x, y)"
                    :class="{ 'player1': value == 1, 'player2': value == 2 }"></td>
            </tr>
        </table>
        <div class="option">
            <!-- 开始新游戏 -->
            <button @click="newGame">重新开始</button>
            <!-- 悔棋 -->
            <button @click="back" :disabled="notMyTurn" :class="{ disabled: notMyTurn }">悔棋</button>
            <router-link to="/home"><button>返回主页</button></router-link>
        </div>
    </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { XWin, YWin, X_YWin, Y_XWin } from '@/utils/gobangRules';
import WebSocket from 'isomorphic-ws';
import { getUUID } from '@/utils/uuid';
export default {
    setup() {
        const data = reactive({
            chessBoard: Array(19).fill(0).map(() => Array(19).fill(0))
        });


        let blackArr = [];
        let whiteArr = [];
        // true为黑手，false为白手
        let blackOrder = ref(true);
        const userId = getUUID();
        let notMyTurn = ref(false);
        let textInfo = ref('');
        let ws;

        // 我方落棋
        const drop = (x, y) => {
            dropForward(x, y);
            let message = {
                "type": "drop",  //向服务器告知的消息类型
                "pid": userId,  //向服务器告知的本玩家ID
                "pointX": x,  //向服务器告知操作棋子点位
                "pointY": y,
                "order": blackOrder.value,  //向服务器告知当前回合
            }
            ws.send(JSON.stringify(message));
            notMyTurn.value = false;
        };

        // 对方落棋
        const dropForward = (x, y) => {
            // 若该点没有棋子
            if (data.chessBoard[x][y] == 0) {
                if (blackOrder.value) {
                    data.chessBoard[x][y] = 1;
                    blackArr.push([x, y]);
                } else {
                    data.chessBoard[x][y] = 2;
                    whiteArr.push([x, y]);
                }
            }
            blackOrder.value = !blackOrder.value;
            XWin(x, y, blackArr, whiteArr, blackOrder);
            YWin(x, y, blackArr, whiteArr, blackOrder);
            X_YWin(x, y, blackArr, whiteArr, blackOrder);
            Y_XWin(x, y, blackArr, whiteArr, blackOrder);
        };

        // 我方悔棋
        const back = () => {
            backForward();
            let message = {
                "type": "back",  //向服务器告知的消息类型
                "pid": userId,  //向服务器告知的本玩家ID
                "order": blackOrder.value,  //向服务器告知当前回合
            }
            ws.send(JSON.stringify(message));
        };

        // 对方悔棋
        const backForward = () => {
            // 如果现在是黑手，则悔棋操作发生在白手
            if (blackOrder.value) {
                let [px, py] = whiteArr[whiteArr.length - 1];
                // 最后一个棋子所在位置置空
                data.chessBoard[px][py] = 0;
                whiteArr.pop();
            } else {
                let [px, py] = blackArr[blackArr.length - 1];
                // 最后一个棋子所在位置置空
                data.chessBoard[px][py] = 0;
                blackArr.pop();
            }
            blackOrder.value = !blackOrder.value;
        }

        // 开始新游戏
        const newGame = () => {
            location.reload();
        };

        // 向服务器发送携带query的请求，返回签发的json web token
        const signIn = (userId) => {
            // var username = document.querySelector("#username").value;
            // let username = 'userA';

            fetch("http://localhost:3000/auth?userid=" + userId)
                .then(response => response.text())
                .then((response) => {
                    if (response.includes("Error")) {
                        alert(response);
                    } else {
                        openWsConnection(response);
                    }
                })
                .catch(err => console.log(err));
        };

        // 携带json web token向WebSocket服务端建立连接
        const openWsConnection = (jwtAuth) => {
            if (ws) {
                ws.close();
            }

            ws = new WebSocket("ws://localhost:3000/ws?token=" + jwtAuth);

            ws.onopen = () => {
                console.log("WebSocket connection established.");
                textInfo.value += `###登录成功，您的ID为${userId}。\n`;
            }

            ws.onmessage = (message) => {
                var msg = JSON.parse(message.data);
                var msgtype = msg.type;
                let lastOrder = msg.order;

                switch (msgtype) {
                    case 'drop':
                        let { pointX, pointY } = msg;
                        textInfo.value += `---${lastOrder ? '白手' : '黑手'}正在下棋。\n`;
                        dropForward(pointX, pointY);
                        notMyTurn.value = true;
                        textInfo.value += '现在到您了。\n';
                        break;
                    case 'back':
                        textInfo.value += `---${lastOrder ? '黑手' : '白手'}悔棋了，对方正在重新下棋。\n`;
                        backForward();
                        break;
                    default:
                        alert("error message!");
                        break;
                }
            }

            ws.onerror = (event) => {
                console.log("WebSocket error received: ", event);
            }

            ws.onclose = () => {
                console.log("WebSocket connection closed.");
            }

        }

        onMounted(() => {
            signIn(userId);
        });


        return {
            data,
            blackOrder,
            notMyTurn,
            textInfo,
            drop,
            back,
            newGame,
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
}

.gobang {
    width: 100vw;
    height: 100vh;
    background: url('@/assets/background2.jpg') no-repeat center fixed;
    background-size: 100% 100%;
    overflow-y: hidden;
    display: flex;
    justify-content: space-around;
}

/* 提示信息 */
.left {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.orderInfo {
    position: relative;
    background-color: olivedrab;
    color: white;
    width: 200px;
    height: 100px;
    text-align: center;
    font-size: 25px;
    border-radius: 10%;
}

.orderWrapper {
    position: absolute;
    width: 100%;
    height: 50px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.order {
    display: inline;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.left textarea {
    position: relative;
    width: 300px;
    height: 500px;
    top: 100px;
    opacity: 70%;
    color: green;
    text-align: left;
    overflow: hidden;
    font-size: 20px;
}

/* 棋盘 */
table {
    background: url(@/assets/golangBoard.jpg) no-repeat;
    background-size: 100%;
    background-position: center;
}

td {
    width: 40px;
    height: 39px;
    border-radius: 50%;
    margin-right: 15px;
    margin-bottom: 15px;
    cursor: pointer;
}

.player1 {
    background-color: black;
}

.player2 {
    background-color: white;
}

/* 游戏选项 */
.option {
    display: flex;
    flex-direction: column;
    position: relative;
}

button {
    width: 200px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-size: 25px;
    background-color: brown;
    border-radius: 10%;
    color: white;
    cursor: pointer;
}

.disabled {
    background-color: rgb(90, 75, 75);
    cursor: default;
}
</style>