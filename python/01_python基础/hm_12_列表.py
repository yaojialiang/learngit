import keyword

name_list = ["zhangsan", "lisi", "wangwu"]

list_len = len(name_list)

name_list.sort()

# name_list.reverse()

# list_index = name_list.index("zhangsan")

# list_idx = name_list[1]

# name_list.pop()

# name_list.insert(1,'len')

# append_list = ['len', 'sharon']

# name_list.extend(append_list)

# name_list.clear()

# for name in name_list:
#     print(name)

# len_tuple = ('len', 18, 1.75, 'male')

# print('my name is %s %d old ,height: %.2f %s' % len_tuple)

xiaoming = {"name":"xiaoming", "age":18, "gender":True, "height":1.75}

x_values = xiaoming.values()

x_keys = xiaoming.keys()

x_items = xiaoming.items()

x_name = xiaoming["name"]

# del xiaoming["name"]
# xiaoming.popitem()
# xiaoming.clear()
# xiaoming['id'] = 1215

# xiaoming.setdefault('id', 1215)
# append_info = {'id':1215, 'school':'hunan'}
# xiaoming.update(append_info)
# for k in xiaoming:
#     print('key:%s value:%s' % (k, xiaoming[k]))
# print(xiaoming)

des = 'hello world'

des_len = len(des)

des_count = des.count('ll')

num_str = '0123456789'

# print(num_str[2:6])
# print(num_str[2:])
# print(num_str[:6])
# print(num_str[:])
# print(num_str[::2])
# print(num_str[1::2])
# print(num_str[2:-1])
# print(num_str[-2:])
# print(num_str[::-1])

text_tuple1 = (1,2,3,4)
text_tuple2 = (1,2,3,4,5)

print(text_tuple1*4)


