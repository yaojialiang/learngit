#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: Marte
# @Date:   2019-05-18 14:15:30
# @Last Modified by:   Marte
# @Last Modified time: 2019-06-22 21:58:00

try:
    print ('try...')
    r = 10 / 0
    print ('result:',r)
except ZeroDivisionError as e:
    print ('except:', e)
finally:
    print ('finally')
print ('End...')


# try:
#     print 'try...'
#     r = 10 / 0
#     print 'result:', r
# except ZeroDivisionError, e:
#     print 'except:', e
# finally:
#     print 'finally...'
# print 'END'