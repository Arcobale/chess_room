<template>
    <div class="othello">
        <!-- 提示信息 -->
        <div class="orderInfo">
            <div class="orderWrapper">
                <div class="order" :class="{ 'player1': data.blackOrder, 'player2': !data.blackOrder }"></div>
                <p>当前回合</p>
            </div>
        </div>
        <!-- 棋盘 -->
        <div id="board" @click="drop" @mouseover="isAllow" @mouseout="removeClass"></div>
        <!-- 游戏选项 -->
        <div class="option">
            <button>
                黑子得分
                <span class="badge black">{{ numOfBlack }}</span>
            </button>
            <button>
                白子得分
                <span class="badge white">{{ numOfWhite }}</span>
            </button>
            <button @click="newGame">重新开始</button>
            <!-- <button @click="back">悔棋</button> -->
            <router-link to="/home"><button>返回主页</button></router-link>
        </div>
    </div>
</template>


<script>
import { reactive, onMounted, computed, onUpdated } from 'vue';
import { allowDrop, reverse, gameOver, isOver } from '@/utils/othelloRules';
export default {
    setup() {
        const data = reactive({
            chessBoard: Array(8).fill(0).map(() => Array(8).fill(0)),
            blackOrder: true,
        })

        onMounted(() => {
            data.chessBoard[3][3] = 2;
            data.chessBoard[3][4] = 1;
            data.chessBoard[4][3] = 1;
            data.chessBoard[4][4] = 2;
            for (let i = 0; i < data.chessBoard.length; i++) {
                for (let j = 0; j < data.chessBoard[0].length; j++) {
                    let cell = document.createElement('div');
                    cell.dataset.x = i;
                    cell.dataset.y = j;
                    cell.id = i * data.chessBoard.length + j;
                    // cell.className = 'player1';
                    cell.className = data.chessBoard[i][j] == 1 ? "player1" : data.chessBoard[i][j] == 2 ? "player2" : '';
                    board.appendChild(cell);
                }
            }
            addDropInfo();
        });

        const numOfBlack = computed(() => {
            let num = 0;
            data.chessBoard.forEach(item => {
                item.forEach(item2 => {
                    if (item2 == 1) num++;
                })
            })
            return num;
        });

        const numOfWhite = computed(() => {
            let num = 0;
            data.chessBoard.forEach(item => {
                item.forEach(item2 => {
                    if (item2 == 2) num++;
                })
            })
            return num;
        });

        const restPoint = computed(() => {
            let arr = [];
            for (let i = 0; i < data.chessBoard.length; i++) {
                for (let j = 0; j < data.chessBoard[0].length; j++) {
                    if (data.chessBoard[i][j] == 0) {
                        arr.push([i, j]);
                    }
                }
            }
            return arr;
        });

        const currentAllow = computed(() => {
            let arr = [];
            for (let i = 0; i < data.chessBoard.length; i++) {
                for (let j = 0; j < data.chessBoard[0].length; j++) {
                    if (allowDrop(i, j, data.chessBoard, data.blackOrder) && data.chessBoard[i][j] == 0) {
                        // let element = document.getElementById(i * data.chessBoard.length + j);
                        // element.classList.add("dashed");
                        arr.push([i, j]);
                    }
                }
            }
            return arr;
        });

        onUpdated(() => {
            addDropInfo();
        })

        // 添加落棋提示
        const addDropInfo = () => {
            for (let position of currentAllow.value) {
                let element = document.getElementById(position[0] * data.chessBoard.length + position[1]);
                element.classList.add("dashed");
            }
        };

        // 去除落棋提示
        const removeDropInfo = () => {
            for (let position of currentAllow.value) {
                let element = document.getElementById(position[0] * data.chessBoard.length + position[1]);
                element.classList.remove("dashed");
            }
        };

        // 落棋事件
        const drop = (event) => {
            let x = parseInt(event.target.dataset.x);
            let y = parseInt(event.target.dataset.y);
            // 若该点可以放置棋子
            if (allowDrop(x, y, data.chessBoard, data.blackOrder)) {
                removeDropInfo();
                // 落棋
                let element = document.getElementById(x * data.chessBoard.length + y);
                if (data.blackOrder) {
                    data.chessBoard[x][y] = 1;
                    element.className = "player1";
                } else {
                    data.chessBoard[x][y] = 2;
                    element.className = "player2";
                }
                // 翻转对手棋子
                reverse(x, y, 0, 1, data.chessBoard, data.blackOrder);
                reverse(x, y, 1, 0, data.chessBoard, data.blackOrder);
                reverse(x, y, 0, -1, data.chessBoard, data.blackOrder);
                reverse(x, y, -1, 0, data.chessBoard, data.blackOrder);
                reverse(x, y, 1, 1, data.chessBoard, data.blackOrder);
                reverse(x, y, 1, -1, data.chessBoard, data.blackOrder);
                reverse(x, y, -1, -1, data.chessBoard, data.blackOrder);
                reverse(x, y, -1, 1, data.chessBoard, data.blackOrder);

                data.blackOrder = !data.blackOrder;

                // 如果棋盘已经走满 或 棋盘再无可下的位置
                if (numOfBlack.value + numOfWhite.value == Math.pow(data.chessBoard.length, 2)
                    || isOver(restPoint, data.chessBoard, data.blackOrder)) {
                    gameOver(numOfBlack.value, numOfWhite.value);
                }
            }
        };

        const isAllow = (event) => {
            if (event.target.id != 'board') {
                let x = parseInt(event.target.dataset.x);
                let y = parseInt(event.target.dataset.y);
                if (allowDrop(x, y, data.chessBoard, data.blackOrder) && data.chessBoard[x][y] == 0) {
                    let element = document.getElementById(x * data.chessBoard.length + y);
                    element.classList.add("allow");
                    if (data.blackOrder) {
                        element.classList.add("player1");
                    } else {
                        element.classList.add("player2");
                    }
                }
            }
        }

        const removeClass = (event) => {
            if (event.target.id != 'board') {
                let x = parseInt(event.target.dataset.x);
                let y = parseInt(event.target.dataset.y);
                if (data.chessBoard[x][y] == 0) {
                    let element = document.getElementById(x * data.chessBoard.length + y);
                    element.classList.remove("allow");
                    if (data.blackOrder) {
                        element.classList.remove("player1");
                    } else {
                        element.classList.remove("player2");
                    }
                }
            }
        }

        // 悔棋事件
        // const back = () => {
        //     // 如果现在是黑手，则悔棋操作发生在白手
        //     if (data.blackOrder) {
        //         let [px, py] = whiteArr[whiteArr.length - 1];
        //         // 最后一个棋子所在位置置空
        //         data.chessBoard[px][py] = 0;
        //         whiteArr.pop();
        //         document.getElementById(px * data.chessBoard.length + py).className = '';
        //     } else {
        //         let [px, py] = blackArr[blackArr.length - 1];
        //         // 最后一个棋子所在位置置空
        //         data.chessBoard[px][py] = 0;
        //         blackArr.pop();
        //         document.getElementById(px * data.chessBoard.length + py).className = '';
        //     }
        //     data.blackOrder = !data.blackOrder;
        // };

        // 开始新游戏

        const newGame = () => {
            location.reload();
        }
        return {
            data,
            numOfBlack,
            numOfWhite,
            restPoint,
            drop,
            // back,
            newGame,
            isAllow,
            removeClass,
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

.othello {
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
    background-color: olivedrab;
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
#board {
    width: 80vw;
    height: 80vw;
    max-width: 600px;
    max-height: 600px;
    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.5) 2.5%, transparent 2.5%), linear-gradient(rgba(0, 0, 0, 0.95) 2.5%, transparent 2.5%);
    border-bottom: solid 1px #000E;
    border-right: solid 1px #000E;
    background-size: 12.5% 12.5%;
    background-color: wheat;
    display: grid;
    grid-template-columns: repeat(8, 12.5%);
    grid-template-rows: repeat(8, 12.5%);
}

/* 棋子 */
#board>div {
    border-radius: 50%;
    margin: 3px;
}

.player1 {
    background-color: black;
}

.player2 {
    background-color: white;
}

.allow {
    opacity: 50%;
}

.dashed {
    border: 1px dashed;
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

/* 视图改变 */
@media only screen and (max-width: 600px) {
    #board {
        width: 50vw;
        height: 50vw;
    }
}
</style>