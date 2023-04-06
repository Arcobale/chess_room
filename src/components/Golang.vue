<template>
    <div class="gobang">
        <div class="orderInfo">
            <div class="order" :class="{ 'player1': blackOrder, 'player2': !blackOrder }"></div><p>Your turn</p>
        </div>
        <table>
            <tr v-for="(row, x) in data.chessBoard" :key="x">
                <td v-for="(value, y) in row" :key="y" @click="drop(x, y)"
                    :class="{ 'player1': value == 1, 'player2': value == 2 }"></td>
            </tr>
        </table>
        <div class="option">
            <!-- 开始新游戏 -->
            <button @click="newGame">New Game</button>
            <!-- 悔棋 -->
            <button @click="back">Undo</button>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { XWin, YWin, X_YWin, Y_XWin } from '@/utils/golangRules';
export default {
    setup() {
        const data = reactive({
            chessBoard: Array(19).fill(0).map(() => Array(19).fill(0))
        })

        let blackArr = [];
        let whiteArr = [];
        // true为黑手，false为白手
        let blackOrder = ref(true);

        // 落棋事件
        const drop = (x, y) => {
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

        // 悔棋事件
        const back = () => {
            // 如果现在是黑手，则悔棋操作发生在白手
            if (blackOrder) {
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
            blackOrder = !blackOrder;
        };

        // 开始新游戏
        const newGame = () => {
            location.reload();
        }
        return {
            data,
            blackOrder,
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
    display: flex;
    justify-content: space-around;
}

.orderInfo {
    position: relative;
    background-color:olivedrab;
    color: white;
    width: 200px;
    height: 100%;
    text-align: center;
    font-size: 25px;
    left:200px;
    top: 150px;
    padding: 20px 0;
    border-radius: 10%;
}

.orderInfo p {
    display: block;
    position: relative;
}

.order {
    float: left;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-left: 20px;
}

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

.option {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    right: 200px;
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
</style>