//横轴获胜逻辑
export function XWin(a, b, blackArr, whiteArr, blackOrder) {
    let x_arr = [];
    let count = 0;

    // 如果现在是黑手，则判断白手输赢
    if (blackOrder.value) {
        // 将上一步下的棋子与整条x轴上的同色棋子进行比较
        for (let position of whiteArr) {
            if (position[0] === a) {
                x_arr.push(position[1]);
            }
        }
    } else {
        for (let position of blackArr) {
            if (position[0] === a) {
                x_arr.push(position[1]);
            }
        }
    }
    // 计算最大同色棋连续个数
    x_arr.sort((a, b) => a - b);
    for (let i = 0; i < x_arr.length - 1; i++) {
        if (x_arr[i] + 1 === x_arr[i + 1]) {
            count++;
            if (count >= 4) break;
        } else {
            count = 0;
        }
    }
    // 需要使用定时器异步操作，不然棋子还没渲染到页面上就提示了
    if (count >= 4) {
        if (blackOrder.value) {
            setTimeout(() => {
                alert('白手获胜！');
                location.reload();
            }, 100);
        } else {
            setTimeout(() => {
                alert('黑手获胜！');
                location.reload();
            }, 100);
        }
    }
}
//竖轴获胜逻辑
export function YWin(a, b, blackArr, whiteArr, blackOrder) {
    let y_arr = [];
    let count = 0;

    // 如果现在是黑手，则判断白手输赢
    if (blackOrder.value) {
        // 将上一步下的棋子与整条y轴上的同色棋子进行比较
        for (let position of whiteArr) {
            if (position[1] === b) {
                y_arr.push(position[0]);
            }
        }
    } else {
        for (let position of blackArr) {
            if (position[1] === b) {
                y_arr.push(position[0]);
            }
        }
    }
    // 计算最大同色棋连续个数
    y_arr.sort((a, b) => a - b);
    for (let i = 0; i < y_arr.length - 1; i++) {
        if (y_arr[i] + 1 === y_arr[i + 1]) {
            count++;
            if (count >= 4) break;
        } else {
            count = 0;
        }
    }
    // 需要使用定时器异步操作，不然棋子还没渲染到页面上就提示了
    if (count >= 4) {
        if (blackOrder.value) {
            setTimeout(() => {
                alert('白手获胜！');
                location.reload();
            }, 100);
        } else {
            setTimeout(() => {
                alert('黑手获胜！');
                location.reload();
            }, 100);
        }
    }
}
//-45度轴获胜逻辑
export function X_YWin(a, b, blackArr, whiteArr, blackOrder) {
    let xy_arr = [];
    let count = 0;

    // 如果现在是黑手，则判断白手输赢
    if (blackOrder.value) {
        // 将上一步下的棋子与整条-45度轴上的同色棋子进行比较
        whiteArr.forEach(position => {
            if (position[0] - a === position[1] - b) {
                xy_arr.push(position);
            }
        });
    } else {
        blackArr.forEach(position => {
            if (position[0] - a === position[1] - b) {
                xy_arr.push(position);
            }
        });
    }
    // 计算最大同色棋连续个数
    xy_arr.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < xy_arr.length - 1; i++) {
        if (xy_arr[i][0] + 1 === xy_arr[i + 1][0] && xy_arr[i][1] + 1 === xy_arr[i + 1][1]) {
            count++;
            if (count >= 4) break;
        } else {
            count = 0;
        }
    }
    // 需要使用定时器异步操作，不然棋子还没渲染到页面上就提示了
    if (count >= 4) {
        if (blackOrder.value) {
            setTimeout(() => {
                alert('白手获胜！');
                location.reload();
            }, 100);
        } else {
            setTimeout(() => {
                alert('黑手获胜！');
                location.reload();
            }, 100);
        }
    }
}
//45度轴获胜逻辑
export function Y_XWin(a, b, blackArr, whiteArr, blackOrder) {
    let yx_arr = [];
    let count = 0;

    // 如果现在是黑手，则判断白手输赢
    if (blackOrder.value) {
        // 将上一步下的棋子与整条-45度轴上的同色棋子进行比较
        whiteArr.forEach(position => {
            if (position[0] - a === b - position[1]) {
                yx_arr.push(position);
            }
        });
    } else {
        blackArr.forEach(position => {
            if (position[0] - a === b - position[1]) {
                yx_arr.push(position);
            }
        });
    }
    // 计算最大同色棋连续个数
    yx_arr.sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < yx_arr.length - 1; i++) {
        if (yx_arr[i][0] - 1 === yx_arr[i + 1][0] && yx_arr[i][1] + 1 === yx_arr[i + 1][1]) {
            count++;
            if (count >= 4) break;
        } else {
            count = 0;
        }
    }
    // 需要使用定时器异步操作，不然棋子还没渲染到页面上就提示了
    if (count >= 4) {
        if (blackOrder.value) {
            setTimeout(() => {
                alert('白手获胜！');
                location.reload();
            }, 100);
        } else {
            setTimeout(() => {
                alert('黑手获胜！');
                location.reload();
            }, 100);
        }
    }
}