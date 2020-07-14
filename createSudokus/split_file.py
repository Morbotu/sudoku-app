from math import ceil

with open("sudoku.csv", "r") as f:
    content = f.read()

content = content.split("\n")
numberOfSplitFile = int(input("How many files do you want?\n"))
n = ceil(1000000/numberOfSplitFile)
splitContent = [content[i:i+n] for i in range(0, len(content), n)]

for i in range(len(splitContent)-1):
    with open("sudokuDataFile" + str(i+1) + ".csv", "w") as f:
        f.write("\n".join(splitContent[i]))
