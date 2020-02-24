import fun

name = '小明'
'''
你好函数
'''


def say_hello():
    """
    你好函数
    """

    print('hello1')
    print('hello2')
    print('hello3')


def sum_2_sum(num1, num2):
    result = num1 + num2
    # print('%d + %d = %d' % (num1, num2, result))
    return result


def print_line(char):
    print(char * 50)


def print_lines(char):
    """

    :param char: 输入字符串
    """
    i = 0
    while i < 5:
        print_line(char)
        i += 1


print_lines('&')