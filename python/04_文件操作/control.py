import os

# read_file = open('test.txt')
# write_file = open('test[复制].txt', 'w')
#
# while True:
#     text = read_file.readline()
#     if not text:
#         break
#     write_file.write(text)
#
# read_file.close()
# write_file.close()

# os.rename('test.txt', '第一次改名.txt')
# os.remove('txt.txt')

listName = os.listdir()
print(listName)
os.mkdir('第一次创建目录')
# os.rmdir('第一次创建目录')

currentDir = os.getcwd()
print(currentDir)






