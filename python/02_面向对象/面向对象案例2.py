class Gun:
    def __init__(self, model):
        self.model = model
        self.bullet_count = 0

    def add_bullet(self, num):
        self.bullet_count += num
        print('装填子弹 %d 发' % self.bullet_count)

    def shoot(self):
        if self.bullet_count > 0:
            self.bullet_count -= 1
            print('%s 射击 [%d]' % (self.model, self.bullet_count))

    def __str__(self):
        return '型号：%s 剩余子弹：%d' % (self.model, self.bullet_count)


class Soldier:
    def __init__(self, name):
        self.name = name
        self.gun = None

    def fire(self):
        if self.gun is None:
            print('%s 没有枪' % self.name)
            return

        print('冲啊。。。 [%s]' % self.name)

        self.gun.add_bullet(50)

        self.gun.shoot()

    def __str__(self):
        return '名字：%s 枪：%s' % (self.name, self.gun)


class Woman:
    gender = 'female'

    def __init__(self, name):
        self.name = name
        self.__age = 18

    def __secret(self):
        print('年龄是 %d' % self.__age)


xiaofang = Woman('小芳')
xiaofang.gender = '666'
print(Woman.gender)



