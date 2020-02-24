#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: Marte
# @Date:   2019-05-19 11:13:43
# @Last Modified by:   Marte
# @Last Modified time: 2019-06-05 00:52:08

import math

def my_abs(x):
    if not isinstance(x,(int,float)):
        raise TypeError('bad operand type');
    if x >= 0:
        return x;
    elif x < 0:
        return -x;


def move(x,y,step,angle=0):
    nx = x + step * math.cos(angle)
    ny = y - step * math.sin(angle)
    return nx , ny

def normalize(name):
    firstChar = name[:1].upper()
    nextChar = name[1:].lower()
    return firstChar + nextChar

def str2float(s):
    front = s.split('.')[0]
    back = s.split('.')[1][::-1]

    front = reduce(lambda x,y: x*10+y,map(int,front))
    back = reduce(lambda x,y: x*0.1+y,map(int,back))*0.1
    return front+back

class Student(object):
    def __init__(self,name,age):
        self._name = name
        self._age = age

    @property
    def name(self):
        return self._name
    
    @property
    def age(self):
        return self._age
    @age.setter 
    def age(self,value):
        if value > 100:
            print('too old')
        elif value < 0:
            print('too young')
        else:
            self._age = value

class Screen(object):
    @property
    def width(self):
        return self._width
    @width.setter
    def width(self,value):
        self._width = value
    @property
    def height(self):
        return self._height
    @height.setter
    def height(self,value):
        self._height = value
    @property
    def resolution(self):
        return self._width * self._height  


class Animal(object):
    # __slots__ = ('name','age')
    def __init__(self,name,age):
        self.a = 0
        self.b = 1
        self.name = name
        self.age = age
    def __iter__(self):
        return self
    def __next__(self):
        self.a, self.b = self.b, self.a + self.b # 计算下一个值
        if self.a > 100000: # 退出循环的条件
            raise StopIteration()
        return self.a # 返回下一个值
    def __getattr__(self,attr):
        if attr == 'score':
            return 99
        raise AttributeError('\'Student\' object has no attribute \'%s\'' % attr)
    def __str__(self):
        return 'Animal object (name:%s)' % self.name
    __repr__ = __str__
    def run(self):
        print('animal is running')

class Fib(object):
    def __init__(self):
        self.a, self.b = 0, 1 # 初始化两个计数器a，b

    def __iter__(self):
        o = self.odd()
        return o # 实例本身就是迭代对象，故返回自己

    def __next__(self):
        self.a, self.b = self.b, self.a + self.b # 计算下一个值
        if self.a > 100000: # 退出循环的条件
            raise StopIteration()
        return self.a # 返回下一个值
    def __getitem__(self,n):
        if n == 0:
            return 0
    def odd(self):
        print('step 1')
        yield 1
        print('step 2')
        yield(3)
        print('step 3')
        yield(5)

class Dog(Animal):
    pass

class Cat(Animal):
    pass


