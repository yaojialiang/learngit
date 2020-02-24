card_list = []


def show_menu():
    print('*'*50)
    print('欢迎使用【名片管理系统】V1.0')
    print('')
    print('1. 新建名片')
    print('2. 显示全部')
    print('3. 查询名片')
    print('')
    print('0. 退出系统')
    print('*' * 50)


def new_card():
    card = {}
    card["name"] = input('请输入您的姓名：')
    card["tel"] = input('请输入您的电话：')
    card["qq"] = input('请输入您的qq号码：')
    card["email"] = input('请输入您的邮箱：')
    card_list.append(card)


def show_all():
    if len(card_list) > 0:
        print('显示全部名单')
        print('-'*50)
        table_head = ('姓名','电话','qq','邮箱')
        for head in table_head:
            print(head,end='\t\t')
        print('')
        print('='*50)
        for obj in card_list:
            print('%s\t\t%s\t\t%s\t\t%s' % (obj['name'],
                                            obj['tel'],
                                            obj['qq'],
                                            obj['email']))
            print('')
        print('-' * 50)
    else:
        print('提示：没有任何名片记录')


def search_card():
    print('查询名片')
    print('-' * 50)
    search_name = input('你要查询的名字：')
    for obj in card_list:
        if search_name == obj["name"]:
            table_head = ('姓名', '电话', 'qq', '邮箱')
            for head in table_head:
                print(head, end='\t\t')
            print('')
            print('-' * 40)
            print('%s\t\t%s\t\t%s\t\t%s' % (obj['name'],
                                            obj['tel'],
                                            obj['qq'],
                                            obj['email']))
            print('-' * 40)
            deal_card(obj)
            break
    else:
        print('没有找到 %s ' % search_name)


def deal_card(find_dict):
    print(find_dict)
    action = input("请选择要执行操作:"
                   "[1] 修改 [2] 删除 [0] 返回上级菜单")
    if action == "1":
        find_dict["name"] = input_card_info(find_dict["name"], '请输入您的名字:')
        find_dict["tel"] = input_card_info(find_dict["tel"], '请输入您的电话：')
        find_dict["qq"] = input_card_info(find_dict["qq"], '请输入您的qq号码：')
        find_dict["email"] = input_card_info(find_dict["email"], '请输入您的邮箱：')
        print('修改成功')
    elif action == "2":
        card_list.remove(find_dict)
        print('删除成功')


def input_card_info(dict_value, tip_message):
    result_str = input(tip_message)

    if len(result_str) > 0:
        return result_str
    else:
        return dict_value

