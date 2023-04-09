<template>
    <div class="gobang">
        <div class="orderInfo">
            <div class="orderWrapper">
                <div class="order" :class="{ 'player1': blackOrder, 'player2': !blackOrder }"></div><p>当前回合</p>
            </div>
        </div>
        <table>
            <tr v-for="(row, x) in data.chessBoard" :key="x">
                <td v-for="(value, y) in row" :key="y" @click="drop(x, y)"
                    :class="{ 'player1': value == 1, 'player2': value == 2 }"></td>
            </tr>
        </table>
        <div class="option">
            <!-- 开始新游戏 -->
            <button @click="newGame">重新开始</button>
            <!-- 悔棋 -->
            <button @click="back">悔棋</button>
            <router-link to="/home"><button>返回主页</button></router-link>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { XWin, YWin, X_YWin, Y_XWin } from '@/utils/gobangRules';
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
            blackOrder.value = !blackOrder.value;
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
    width: 100vw;
    height: 100vh;
    background: url('@/assets/background2.jpg') no-repeat center fixed;
    background-size: 100% 100%;
    overflow-y: hidden;
    display: flex;
    justify-content: space-around;
}

/* 提示信息 */
.orderInfo {
    position: relative;
    background-color:olivedrab;
    color: white;
    width: 200px;
    height: 100px;
    text-align: center;
    font-size: 25px;
    padding: 20px 0;
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
</style>