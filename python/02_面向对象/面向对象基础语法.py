class Cat:
    def __init__(self, name):
        self.name = name
        print('初始化方法')

    def __del__(self):
        print('%s 被销毁了' % self.name)

    def __str__(self):
        return '我是小猫 %s' % self.name

    def eat(self):
        print('%s 爱吃鱼' % self.name)

    def drink(self):
        print('%s 在喝水' % self.name)


tom = Cat('大懒猫')
tom.eat()
tom.drink()

print(tom)
del tom
