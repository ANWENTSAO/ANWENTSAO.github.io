#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import math

in_hr = 2400 #尖峰小時(上午)進站旅客流量
out_hr = 600 #尖峰小時(上午)進站旅客流量
in_min = 60  #尖峰分鐘(上午)進站旅客流量
out_min = 15 #尖峰分鐘(上午)進站旅客流量

class NumCheck:
    def __init__(self, in_hr, out_hr, in_min, out_min):
        self.in_hr = in_hr
        self.out_hr = out_hr
        self.in_min = in_min
        self.out_min = out_min     
        if input("是否為單大廳？（y/n）： ").lower() != 'y':
            self.pao_num = 2
        else:
            self.pao_num = 1

    def elevator_num(self):  # 電扶梯及樓梯數量檢核
        self.elevator_result = max((math.ceil(self.in_min / 146) + math.ceil(self.out_min / 110)),
                                   (math.ceil(self.out_min / 146) + math.ceil(self.in_min / 110)))

    def sell_num(self):  # 自動售票機數量檢核
        self.sell_result = max((math.ceil((self.in_min * 0.18) / 5) + 1), 2 * self.pao_num)
        self.presell_result = math.ceil((self.in_min * 0.18 * 0.5) / 5)

    def ticket_num(self):  # 驗票閘門數量檢核
        self.ticket_result = max(2 * self.pao_num, 1 + max((math.ceil(self.in_min / 45) + math.ceil(self.out_min * 1.25 / 45)),
                                                           (math.ceil(self.out_min / 45) + math.ceil(self.in_min * 1.25 / 45))))
    
    def toilet_num(self): # 公廁數量檢核
        sum_hr = self.in_hr + self.out_hr
        if sum_hr <= 10000:
            self.toilet_result = {
                '男廁大便器':2,
                '男廁小便器':4,
                '男廁洗面盆':2,
                '女廁大便器':10,
                '女廁洗面盆':3,
                '無障礙廁所':1,
                '親子廁所(無障礙廁所)':1}
        elif 10000 < sum_hr <= 15000:
            self.toilet_result = {
                '男廁大便器':3,
                '男廁小便器':6,
                '男廁洗面盆':2,
                '女廁大便器':15,
                '女廁洗面盆':4,
                '無障礙廁所':1,
                '親子廁所(無障礙廁所)':1}
        elif 15000 < sum_hr <= 20000:
            self.toilet_result = {
                '男廁大便器':4,
                '男廁小便器':8,
                '男廁洗面盆':3,
                '女廁大便器':20,
                '女廁洗面盆':5,
                '無障礙廁所':1,
                '親子廁所(無障礙廁所)':1}
        else:
            self.toilet_result = {
                '男廁大便器':5,
                '男廁小便器':10,
                '男廁洗面盆':3,
                '女廁大便器':25,
                '女廁洗面盆':6,
                '無障礙廁所':1,
                '親子廁所(無障礙廁所)':1}
        
    def get_results(self):
        return {
            "各樓層電扶梯需求數": self.elevator_result,
            "自動售票機安裝數量": self.sell_result,
            "自動售票機預留數量": self.presell_result,
            "一般通道含備用的驗票閘門數量": self.ticket_result,
            "無障礙通道的驗票閘門數量": self.pao_num,
            "公廁數量": self.toilet_result
        }

calculate_num = NumCheck(in_hr, out_hr, in_min, out_min)

# 計算每個檢核數量
calculate_num.elevator_num()
calculate_num.sell_num()
calculate_num.ticket_num()
calculate_num.toilet_num()
results = calculate_num.get_results()

# 輸出結果  
#isinstance(value, dict):第一個参数是要檢查的对象，第二個参数是要檢查的類型。如果 value 是字典為True，其餘為 False。

for key, value in results.items():
    if isinstance(value, dict): #先判斷如果是字典:就輸出value(公廁種類)
        print(key,":")
        for facility, count in value.items(): #歷遍字典 value中的键值。在每次迭代中，將键赋值给 facility(設施)，將值赋值给 count(數量)
            print(facility, "=", count)
    else:
        print(key, "=", value)

