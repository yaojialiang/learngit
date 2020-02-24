
# try:
#     num = int(input('请输入数字：'))
#     result = 8/num
# except ValueError:
#     print('请输入正确的数字')
# except ZeroDivisionError:
#     print('除0错误')
# except Exception as result:
#     print('未知错误 %s' % result)
# else:
#     print('正常执行')
# finally:
#     print('执行完成，但不保证正确')


def input_password():
    psd = input('请输入密码：')
    if len(psd) > 8:
        return psd

    ex = Exception('密码长不够')
    raise(ex)

try:
    input_password()
except Exception as result:
    print('发现错误： %s' % result)