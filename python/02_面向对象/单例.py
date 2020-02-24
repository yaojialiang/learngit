class MusicPlayer:

    instance = None

    init_flag = False

    def __new__(cls, *args, **kwargs):
        if cls.instance is None:
            print('开始为对象分配空间')
            cls.instance = super().__new__(cls)
        return cls.instance

    def __init__(self):
        if not MusicPlayer.init_flag:
            print('初始化动作')
            MusicPlayer.init_flag = True


player1 = MusicPlayer()
player2 = MusicPlayer()
player3 = MusicPlayer()

print(player1)
print(player2)
print(player3)


