class Numcheck{
    constructor(check_box, in_hr, out_hr, in_min, out_min, pao_num){
        this.in_hr = in_hr;
        this.out_hr = out_hr;
        this.in_min = in_min;
        this.out_min = out_min;
        if(check_box!='yes')
        {
            this.pao_num = 2;
        }else{
            this.pao_num = 1;
        }
    }

    elevator_num(){
        var elevator_result = Math.max((Math.ceil(this.in_min / 146) + Math.ceil(this.out_min / 110)),
                              (Math.ceil(this.out_min / 146) + Math.ceil(this.in_min / 110)));
        return elevator_result;
    }

    sell_num(){
        var sell_result = Math.max((Math.ceil((this.in_min * 0.18) / 5) + 1), 2 * this.pao_num);
        var presell_result = Math.ceil((this.in_min * 0.18 * 0.5) / 5);

        var temp_list = [sell_result, presell_result];
        return temp_list;
    }

    ticket_num(){
        var ticket_result = Math.max(2 * this.pao_num, 1 + Math.max((Math.ceil(this.in_min / 45) + Math.ceil(this.out_min * 1.25 / 45)),
                                                      (Math.ceil(this.out_min / 45) + Math.ceil(this.in_min * 1.25 / 45))));
        return ticket_result;
    }

    toilet_num(){
        var sum_hr = this.in_hr + this.out_hr;
        var toilet_result;
        if (sum_hr <= 10000){
            toilet_result = {
                '男廁大便器':2,
                '男廁小便器':4,
                '男廁洗面盆':2,
                '女廁大便器':10,
                '女廁洗面盆':3,
                '無障礙廁所':1,
                '親子廁所(無障礙廁所)':1
            }
        }else if(10000 < sum_hr <= 15000){
            toilet_result = {
                '男廁大便器':3,
                '男廁小便器':6,
                '男廁洗面盆':2,
                '女廁大便器':15,
                '女廁洗面盆':4,
                '無障礙廁所':1,
                '親子廁所(無障礙廁所)':1}
        }else if(15000 < sum_hr <= 20000){
            toilet_result = {
                '男廁大便器':4,
                '男廁小便器':8,
                '男廁洗面盆':3,
                '女廁大便器':20,
                '女廁洗面盆':5,
                '無障礙廁所':1,
                '親子廁所(無障礙廁所)':1}
        }else{
            toilet_result = {
                '男廁大便器':5,
                '男廁小便器':10,
                '男廁洗面盆':3,
                '女廁大便器':25,
                '女廁洗面盆':6,
                '無障礙廁所':1,
                '親子廁所(無障礙廁所)':1}
        }
        return toilet_result;
    }

    get_result(){
        return {
            "各樓層電扶梯需求數": this.elevator_num(),
            "自動售票機安裝數量": this.sell_num()[0],
            "自動售票機預留數量": this.sell_num()[1],
            "一般通道含備用的驗票閘門數量": this.ticket_num(),
            "無障礙通道的驗票閘門數量": this.pao_num,
            "公廁數量": this.toilet_num()
        }
    }
}

document.getElementById("result_text_tag").style.display = 'none';

id_list = ["checkbox","in_hr","out_hr","in_min","out_min"];

var checkbox_input = "yes";
var in_hr_input = 0;
var out_hr_input = 0;
var in_min_input = 0;  
var out_min_input = 0;

for(const element of id_list){
    var tab_id = document.getElementById(element);
    tab_id.addEventListener("change",function(event){
        
        if(element != "checkbox"){
            eval(element + "_input" + " = " + new String(event.target.value));
        }else{
            eval(element + "_input" + " = \"" + event.target.value + "\"");
        }
        // console.log(checkbox_input,in_hr_input,out_hr_input,in_min_input,out_min_input);
        
        if((in_hr_input!=0) && (out_hr_input!=0) && (in_min_input!=0) && (out_min_input!=0))
        {   
            document.getElementById("result_text_tag").style.display = 'inline';

            var result_class = new Numcheck(checkbox_input, in_hr_input, out_hr_input, in_min_input, out_min_input);
            // test
            // console.log(Object.keys(result_class.get_result()));

            var result_key_list = Object.keys(result_class.get_result());

            var result_table = document.getElementById("result_table");
            
            while (result_table.firstChild) {
                result_table.removeChild(result_table.firstChild);
            }
            
            for(const element2 of result_key_list){
                
                tr = document.createElement("tr");
                result_table.appendChild(tr);

                th = document.createElement("th");
                th.textContent = element2;
                tr.appendChild(th);

                if(element2 == "公廁數量")
                {
                    for(const element3 of Object.keys(result_class.get_result()[element2])){
                        // 透過用tr達到換行效果
                        tr_2 = document.createElement("tr");
                        tr_2.id = "tr_2";
                        tr.appendChild(tr_2);

                        td_1 = document.createElement("td");
                        td_2 = document.createElement("td");

                        td_1.textContent = element3;
                        td_2.textContent = result_class.get_result()[element2][element3];

                        tr_2.appendChild(td_1);
                        tr_2.appendChild(td_2);
                    }
                }else{
                    td = document.createElement("td");
                    td.textContent = result_class.get_result()[element2];
                    tr.appendChild(td);
                }            
            }
        }
    })
    
}