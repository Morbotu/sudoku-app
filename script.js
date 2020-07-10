var app = angular.module("sudoku", []);
var notPossibleToFillIn = false;
var sudoku;

app.controller("sudokuController", async ($scope, $timeout) => {
    $scope.selectedNumber = "1";
    $scope.hintUses = 3;
    $scope.mistakes = 0;

    $scope.loading = true;
    await fetch("sudoku.csv")
        .then((response) => response.text())
        .then((data) => {
            let index = Math.ceil(Math.random() * 1000000);
            sudoku = data.split("\n")[index].split(",");
            sudoku[0] = sudoku[0].split("").map((item) => {
                return item === "0" ? "" : item;
            });
            let res = [];
            for (let i = 0; i < 9; i++) res.push(sudoku[0].splice(0, 9));
            sudoku[0] = res;
            sudoku[1] = sudoku[1].split("");
            res = [];
            for (let i = 0; i < 9; i++) res.push(sudoku[1].splice(0, 9));
            sudoku[1] = res;
            $scope.cells = sudoku[0];
            $scope.$applyAsync();
        });
    $scope.loading = false;

    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            if ($scope.cells[i][j] !== "")
                document.querySelector(
                    `tr:nth-child(${j + 1}) > td:nth-child(${i + 1})`
                ).style.fontWeight = "bolder";

    $scope.changeSelectedNumber = (number) => {
        $scope.selectedNumber = number;
    };

    $scope.fillInNumber = (x, y) => {
        var mistakeMade = false;
        var audio = new Audio("Wrong-answer-sound-effect.mp3");
        if (
            document.querySelector(`tr:nth-child(${y + 1}) > td:nth-child(${x + 1})`).style
                .fontWeight === "bold" ||
            notPossibleToFillIn
        )
            return;
        if ($scope.selectedNumber === "clear") {
            $scope.cells[x][y] = "";
            return;
        }
        if ($scope.selectedNumber === "hint") {
            if ($scope.hintUses <= 0) {
                audio.play();
                $scope.shaking = { animation: "shake 0.82s" };
                notPossibleToFillIn = true;
                $timeout(function () {
                    $scope.shaking = { animation: "" };
                    notPossibleToFillIn = false;
                }, 820);
                return;
            }
            $scope.hintUses--;
            $scope.cells[x][y] = sudoku[1][x][y];
            return;
        }
        $scope.cells[x][y] = $scope.selectedNumber;

        // Check if the number is allowed to be there.
        // Check if the number is on the wrong number.
        if ($scope.cells[x][y] !== sudoku[1][x][y]) {
            var item = document.querySelector(`tr:nth-child(${y + 1}) > td:nth-child(${x + 1})`);
            item.style.background = "red";
            item.style.transition = "background 0.5s";
            notPossibleToFillIn = true;
            mistakeMade = true;
            audio.play();
            $timeout(function () {
                $scope.cells[x][y] = "";
                item.style.background = "";
                setTimeout(function () {
                    item.style.transition = "";
                    notPossibleToFillIn = false;
                }, 500);
            }, 1000);
        }

        // This one checks for vertical numbers.
        if ($scope.cells[x].filter((cell) => cell === $scope.cells[x][y]).length > 1) {
            document.querySelectorAll(`td:nth-child(${x + 1})`).forEach((item) => {
                item.style.background = "red";
                item.style.transition = "background 0.5s";
                notPossibleToFillIn = true;
                mistakeMade = true;
                audio.play();
            });
            $timeout(function () {
                $scope.cells[x][y] = "";
                document.querySelectorAll(`td:nth-child(${x + 1})`).forEach((item) => {
                    item.style.background = "";
                    setTimeout(function () {
                        item.style.transition = "";
                        notPossibleToFillIn = false;
                    }, 500);
                });
            }, 1000);
        }

        // This one checks for horizontal numbers.
        if ($scope.cells.filter((row) => row[y] === $scope.cells[x][y]).length > 1) {
            document.querySelectorAll(`tr:nth-child(${y + 1}) > td`).forEach((item) => {
                item.style.background = "red";
                item.style.transition = "background 0.5s";
                notPossibleToFillIn = true;
                mistakeMade = true;
                audio.play();
            });
            $timeout(function () {
                $scope.cells[x][y] = "";
                document.querySelectorAll(`tr:nth-child(${y + 1}) > td`).forEach((item) => {
                    item.style.background = "";
                    setTimeout(function () {
                        item.style.transition = "";
                        notPossibleToFillIn = false;
                    }, 500);
                });
            }, 1000);
        }

        // This one checks for numbers in the same 3x3 area.
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (x >= i * 3 && x < i * 3 + 3 && y >= j * 3 && y < j * 3 + 3) {
                    if (
                        $scope.cells.reduce((accumulator, row, index) => {
                            if (index >= i * 3 && index < i * 3 + 3)
                                return (accumulator += row.filter(
                                    (cell, index) =>
                                        cell === $scope.cells[x][y] &&
                                        index >= j * 3 &&
                                        index < j * 3 + 3
                                ).length);
                            return accumulator;
                        }, 0) > 1
                    ) {
                        document
                            .querySelectorAll(
                                `tr:not(:nth-child(-n+${j * 3})):nth-child(-n+${
                                    (j + 1) * 3
                                }) > td:not(:nth-child(-n+${i * 3})):nth-child(-n+${(i + 1) * 3})`
                            )
                            .forEach((item) => {
                                item.style.background = "red";
                                item.style.transition = "background 0.5s";
                                notPossibleToFillIn = true;
                                mistakeMade = true;
                                audio.play();
                            });
                        $timeout(function () {
                            $scope.cells[x][y] = "";
                            document
                                .querySelectorAll(
                                    `tr:not(:nth-child(-n+${j * 3})):nth-child(-n+${
                                        (j + 1) * 3
                                    }) > td:not(:nth-child(-n+${i * 3})):nth-child(-n+${
                                        (i + 1) * 3
                                    })`
                                )
                                .forEach((item) => {
                                    item.style.background = "";
                                    setTimeout(function () {
                                        item.style.transition = "";
                                        notPossibleToFillIn = false;
                                    }, 500);
                                });
                        }, 1000);
                    }
                }
        if (mistakeMade) $scope.mistakes++;
        if (JSON.stringify($scope.cells) === JSON.stringify(sudoku[1]))
            document.write("<h1>You won!</h1>");
    };
});
