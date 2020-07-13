from math import ceil

with open("sudoku.csv", "r") as f:
    content = f.read()

content = content.split("\n")
n = ceil(1000000/7)
splitContent = [content[i:i+n] for i in range(0, len(content), n)]

for i in range(len(splitContent)):
    with open("sudokuDataFile" + str(i+1) + ".csv", "w") as f:
        f.write("\n".join(splitContent[i]))
