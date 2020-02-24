# has_ticket = bool(int(input('有没有票：')))
# knife_length = int(input('刀的长度：'))

# if has_ticket:
#     print('有票可以开始安检')
#     if knife_length > 20:
#         print('不允许带 %d 的道具上车' % knife_length)
#     else:
#         print('安检通过')
# else:
#     print('大哥要买票')

import random

# 石头1 剪刀2 布3
player = int(input('请出拳 石头1/ 剪刀2/ 布3:'))
computer = random.randint(1, 3)

if player == 1:
    print('你出石头')
elif player == 2:
    print('你出剪刀')
elif player == 3:
    print('你出布')

if computer == 1:
    print('电脑出石头')
elif computer == 2:
    print('电脑出剪刀')
elif computer == 3:
    print('电脑出布')

if ((player == 1 and computer == 2) or
    (player == 2 and computer == 3) or
    (player == 3 and computer == 1)):
    print('你赢了')
elif player == computer:
    print('平手')
else:
    print('你输了')


