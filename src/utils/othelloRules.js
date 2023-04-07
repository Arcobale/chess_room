// 判断该点是否合法
function isInBoard(a, b, board) {
    return a >= 0 && a < board.length && b >= 0 && b < board.length;
}

// 判断该点是否为空
function isEmpty(a, b, board) {
    return board[a][b] == 0;
}

// 判断该点是否为我方棋子
function isMyPoint(a, b, board, order) {
    if (order) {
        return board[a][b] == 1;
    } else {
        return board[a][b] == 2;
    }
}

// 判断某一方向上是否可以形成夹击之势
function direction(a, b, w, v, board, order) {
    let flag = false;
    a += w;
    b += v;
    // 在某一方向上是否有可以夹击的棋子
    while (isInBoard(a, b, board) && !isEmpty(a, b, board) && !isMyPoint(a, b, board, order)) {
        a += w;
        b += v;
        flag = true;
    }
    // 如果最后停止在我方棋子上，并且标志为true
    if (isInBoard(a, b, board) && isMyPoint(a, b, board, order) && flag) {
        return true;
    }
    return false;
}

// 判断当前位置是否可以落子
export function allowDrop(a, b, board, order) {
    // 正右
    if (direction(a, b, 0, 1, board, order)) {
        return true;
    }
    // 正下
    if (direction(a, b, 1, 0, board, order)) {
        return true;
    }
    // 正左
    if (direction(a, b, 0, -1, board, order)) {
        return true;
    }
    // 正上
    if (direction(a, b, -1, 0, board, order)) {
        return true;
    }
    // 右下
    if (direction(a, b, 1, 1, board, order)) {
        return true;
    }
    // 左下
    if (direction(a, b, 1, -1, board, order)) {
        return true;
    }
    // 左上
    if (direction(a, b, -1, -1, board, order)) {
        return true;
    }
    // 右上
    if (direction(a, b, -1, 1, board, order)) {
        return true;
    }
    return false;
}

// 翻转某一方向上的对手棋子
export function reverse(a, b, w, v, board, order) {
    let flag = false;
    let startX = a;
    let startY = b;
    a += w;
    b += v;
    // 在某一方向上是否有可以夹击的棋子
    while (isInBoard(a, b, board) && !isEmpty(a, b, board) && !isMyPoint(a, b, board, order)) {
        a += w;
        b += v;
        flag = true;
    }
    // 如果最后停止在我方棋子上，并且标志为true
    if (isInBoard(a, b, board) && isMyPoint(a, b, board, order) && flag) {
        a -= w;
        b -= v;
        while (a != startX || b != startY) {
            board[a][b] = order ? 1 : 2;
            document.getElementById(a * board.length + b).className = order ? "player1" : "player2";
            a -= w;
            b -= v;
        }
    }
}

export function gameOver(numOfBlack, numOfWhite) {
    setTimeout(() => {
        if (numOfBlack > numOfWhite) {
            alert('游戏结束，黑方获胜！');
        } else if (numOfBlack < numOfWhite) {
            alert('游戏结束，白方获胜！');
        } else {
            alert('游戏结束，平局！');
        }
        location.reload();
    }, 100);
}

export function isOver(restPoint, board, order) {
    for (let position of restPoint.value) {
        if (allowDrop(position[0], position[1], board, order)) {
            return false;
        }
    }
    return true;
}