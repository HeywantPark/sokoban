// sokoban.js

let ROWS = 7, COLS = 7;
let mapData = [];
let playerPos = { row: 0, col: 0 };
let level = 1;

// 초기 맵 데이터 생성
function generateMap() {
    mapData = Array.from({ length: ROWS }, () => Array(COLS).fill(" "));

    // 외곽에 벽 배치
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
                mapData[r][c] = "#"; // 벽
            }
        }
    }

    // 벽 배치: 중앙에 랜덤 장애물 추가
    for (let i = 0; i < 5; i++) {
        let r = Math.floor(Math.random() * (ROWS - 2)) + 1;
        let c = Math.floor(Math.random() * (COLS - 2)) + 1;
        if (mapData[r][c] === " ") mapData[r][c] = "#"; // 벽 추가
    }

    // 박스와 구멍 추가
    let placedBoxes = 0;
    let placedGoals = 0;
    while (placedBoxes < 3 || placedGoals < 3) {
        let r = Math.floor(Math.random() * (ROWS - 2)) + 1;
        let c = Math.floor(Math.random() * (COLS - 2)) + 1;

        // 박스 추가
        if (placedBoxes < 3 && mapData[r][c] === " " && !isNearWall(r, c)) {
            mapData[r][c] = "o"; // 박스
            placedBoxes++;
        }

        // 구멍 추가
        if (placedGoals < 3 && mapData[r][c] === " ") {
            mapData[r][c] = "O"; // 구멍
            placedGoals++;
        }
    }

    // 플레이어 추가: 박스와 멀리 떨어진 곳에 배치
    while (true) {
        let r = Math.floor(Math.random() * (ROWS - 2)) + 1;
        let c = Math.floor(Math.random() * (COLS - 2)) + 1;
        if (mapData[r][c] === " ") {
            mapData[r][c] = "P"; // 플레이어
            playerPos = { row: r, col: c };
            break;
        }
    }
}

// 박스가 벽과 너무 가까운지 확인
function isNearWall(r, c) {
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
    ];
    for (let dir of directions) {
        let nr = r + dir.row;
        let nc = c + dir.col;
        if (mapData[nr][nc] === "#") {
            return true; // 벽 근처
        }
    }
    return false;
}

// 맵 렌더링 함수
function renderMap() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    gameBoard.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

    mapData.forEach((row) => {
        row.forEach((tile) => {
            const div = document.createElement("div");
            div.classList.add("tile");

            if (tile === "#") div.classList.add("wall");
            else if (tile === "O") div.classList.add("goal");
            else if (tile === "o") div.classList.add("box");
            else if (tile === "P") div.classList.add("player");
            else div.classList.add("empty");

            gameBoard.appendChild(div);
        });
    });
}

// 박스 이동 및 플레이어 이동 로직
function movePlayer(direction) {
    const { row, col } = playerPos;
    const moves = {
        up: { row: -1, col: 0 },
        down: { row: 1, col: 0 },
        left: { row: 0, col: -1 },
        right: { row: 0, col: 1 },
    };

    const newRow = row + moves[direction].row;
    const newCol = col + moves[direction].col;
    const beyondRow = newRow + moves[direction].row;
    const beyondCol = newCol + moves[direction].col;

    // 박스 이동
    if (mapData[newRow][newCol] === "o") {
        // 박스가 이동 가능한 경우
        if (mapData[beyondRow][beyondCol] === " " || mapData[beyondRow][beyondCol] === "O") {
            mapData[beyondRow][beyondCol] = "o"; // 박스를 새 위치로 이동
            mapData[newRow][newCol] = "P"; // 플레이어 위치로 박스를 옮김
            mapData[row][col] = " "; // 플레이어 원래 위치 비우기
            playerPos = { row: newRow, col: newCol }; // 플레이어 새로운 위치 저장
        }
    }
    // 플레이어만 이동
    else if (mapData[newRow][newCol] === " " || mapData[newRow][newCol] === "O") {
        mapData[row][col] = " "; // 이전 위치 비움
        mapData[newRow][newCol] = "P"; // 새 위치로 이동
        playerPos = { row: newRow, col: newCol }; // 플레이어 위치 업데이트
    }

    renderMap();
    checkWinCondition();
}

// 승리 조건 확인
function checkWinCondition() {
    const allBoxesInGoals = mapData.every((row) =>
        row.every((tile) => tile !== "o" || tile === "O")
    );

    if (allBoxesInGoals) {
        setTimeout(() => {
            alert(`축하합니다! 레벨 ${level}을 클리어했습니다!`);
            level++;
            ROWS++;
            COLS++;
            generateMap();
            renderMap();
        }, 500);
    }
}

// 초기화 및 이벤트 리스너 추가
document.getElementById("up-btn").onclick = () => movePlayer("up");
document.getElementById("down-btn").onclick = () => movePlayer("down");
document.getElementById("left-btn").onclick = () => movePlayer("left");
document.getElementById("right-btn").onclick = () => movePlayer("right");

generateMap();
renderMap();
