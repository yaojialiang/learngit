# num = 10
#
#
# def demo1():
#
#     print("demo1" + "-" * 50)
#
#     # global 关键字，告诉 Python 解释器 num 是一个全局变量
#     # global num
#     # 只是定义了一个局部变量，不会修改到全局变量，只是变量名相同而已
#     num = 100
#     print(num)
#
#
# def demo2():
#
#     print("demo2" + "-" * 50)
#     print(num)
#
# demo1()
# demo2()
#
# print("over")


# def measure():
#     """返回当前的温度"""
#
#     print("开始测量...")
#     temp1 = 39
#     wetness1 = 10
#     print("测量结束...")
#
#     return temp1, wetness1
#
#
# result = temp, wetness = measure()
#
# print(result)

def demo(num, num_list):

    print("函数内部代码")

    # num = num + num
    num += num
    # num_list.extend(num_list) 由于是调用方法，所以不会修改变量的引用
    # 函数执行结束后，外部数据同样会发生变化
    num_list += num_list

    print(num)
    print(num_list)
    print("函数代码完成")


gl_num = 9
gl_list = [1, 2, 3]
demo(gl_num, gl_list)
print(gl_num)
print(gl_list)
