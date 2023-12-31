// var sand_arr = ['SF','SM','GP-GM','GP','SM-ML']
var clay_arr = ['CL','ML']

class class_soil{
    constructor(soil_classification, depth, unit_weight, N_value, C_value, Theta_cl, Alpha_cl, phi, Su, drain_or_not, Ka, Kp, Ko, Kh){
        this.soil_classification = soil_classification;
        this.depth = depth;
        this.unit_weight = unit_weight;
        this.N_value = N_value;
        this.C_value = C_value;
        this.Theta_cl =Theta_cl;
        this.Alpha_cl =Alpha_cl;
        this.phi = phi;
        this.Su = Su;
        this.drain_or_not = drain_or_not;
        this.Ka = Math.round(Math.cos((phi-Theta_cl)/180*Math.PI)**2
                    /(Math.cos(Theta_cl/180*Math.PI)**2*
                      Math.cos((Theta_cl+phi/2)/180*Math.PI)*
                      ((1+Math.sqrt(Math.sin((phi+phi/2)/180*Math.PI)*Math.sin((phi-Alpha_cl)/180*Math.PI)
                      /(Math.cos((phi/2+Theta_cl)/180*Math.PI)*Math.cos((Theta_cl-Alpha_cl)/180*Math.PI))))**2))*100)/100;
        this.Kp = Math.round(Math.cos((phi+Theta_cl)/180*Math.PI)**2
                    /(Math.cos(Theta_cl/180*Math.PI)**2*
                    Math.cos((Theta_cl-phi/2)/180*Math.PI)*
                    ((1-Math.sqrt(Math.sin((phi+phi/2)/180*Math.PI)*Math.sin((phi+Alpha_cl)/180*Math.PI)
                    /(Math.cos((Theta_cl-phi/2)/180*Math.PI)*Math.cos((Theta_cl-Alpha_cl)/180*Math.PI))))**2)),-2);
        this.Ko = Math.round(1-Math.sin(phi/180*Math.PI),-2);
        if(clay_arr.includes(soil_classification.substring(0,2))||clay_arr.includes(soil_classification)){
            this.Kh = 1000*Su;
        }else{
            this.Kh = 70*N_value;
        }         
    }

    recall(){
        var soil_classification = this.soil_classification;
        var N_value = this.N_value;
        var Theta_cl = this.Theta_cl;
        var Alpha_cl = this.Alpha_cl;
        var phi = this.phi;
        var Su = this.Su;
        var drain_or_not = this.drain_or_not;
        this.Ka = Math.round(Math.cos((phi-Theta_cl)/180*Math.PI)**2
                /(Math.cos(Theta_cl/180*Math.PI)**2*
                  Math.cos((Theta_cl+phi/2)/180*Math.PI)*
                  ((1+Math.sqrt(Math.sin((phi+phi/2)/180*Math.PI)*Math.sin((phi-Alpha_cl)/180*Math.PI)
                  /(Math.cos((phi/2+Theta_cl)/180*Math.PI)*Math.cos((Theta_cl-Alpha_cl)/180*Math.PI))))**2))*100)/100;
        this.Kp = Math.round(Math.cos((phi+Theta_cl)/180*Math.PI)**2
                    /(Math.cos(Theta_cl/180*Math.PI)**2*
                    Math.cos((Theta_cl-phi/2)/180*Math.PI)*
                    ((1-Math.sqrt(Math.sin((phi+phi/2)/180*Math.PI)*Math.sin((phi+Alpha_cl)/180*Math.PI)
                    /(Math.cos((Theta_cl-phi/2)/180*Math.PI)*Math.cos((Theta_cl-Alpha_cl)/180*Math.PI))))**2)),-2);
        this.Ko = Math.round(1-Math.sin(phi/180*Math.PI),-2);
        if(clay_arr.includes(soil_classification.substring(0,2))||clay_arr.includes(soil_classification)){
            this.Kh = 1000*Su;
        }else{
            this.Kh = 70*N_value;
        }
    }
}

class bulge_parameter{
    constructor(radius,depth,Su,theta,torque){
        this.radius = radius;
        // depth 可移除
        this.depth = depth;
        this.Su = Su;
        this.theta = theta;
        this.torque = radius*theta*Su;
    }
}

class a_p_pressure{
    // t_p for top_buttom, b_p for button_buttom
    constructor(upper,height,t_p,b_p,centroid_posi,Pa){
        this.upper = upper;
        this.height = height;
        this.t_p = t_p;
        this.b_p = b_p;
        this.centroid_posi = upper + height/3*(t_p+2*b_p)/(t_p+b_p);
        this.Pa = (t_p+b_p)*height/2;
    }
}

class exca_steps{
    constructor(step,step_depth){
        this.step = step;
        this.step_depth = step_depth;
    }
}

// G_W_T for ground_water_table
var Theta,Alpha,last_support,excavation_depth,G_W_T;

//soil 存土層資料
var soil = [];

// class的全部屬性
var list_of_class = ["soil_classification", "depth", "unit_weight", "N_value", "C_value", "phi", "Su", "drain_or_not", "Ka", "Kp", "Ko", "Kh"];
var add_value;

function add_basic_parameter(){
    Theta = Number(document.getElementById("Theta").value);
    Alpha = Number(document.getElementById("Alpha").value);
    G_W_T = Number(document.getElementById("G_W_T").value);
    last_support = Number(document.getElementById("last_support").value);
    excavation_depth = Number(document.getElementById("excavation_depth").value);


    document.getElementById("Theta").readOnly = true;
    document.getElementById("Alpha").readOnly = true;
    document.getElementById("G_W_T").readOnly = true;
    document.getElementById("last_support").readOnly = true;
    document.getElementById("excavation_depth").readOnly = true;
    // document.getElementById("Theta").value = "";
    // document.getElementById("Alpha").value = "";
}

function rewrite_basic_parameter(){
    document.getElementById("Theta").readOnly = false;
    document.getElementById("Alpha").readOnly = false;
    document.getElementById("last_support").readOnly = false;
    document.getElementById("excavation_depth").readOnly = false;
}

// function add_soil_horizon(){
//     var soil_horizon = new class_soil(
//         document.getElementById("soil_classification").value,
//         Number(document.getElementById("depth").value),
//         Number(document.getElementById("unit_weight").value),
//         Number(document.getElementById("N_value").value),
//         Number(document.getElementById("C_value").value),
//         Number(Theta),Number(Alpha),
//         Number(document.getElementById("phi_value").value),
//         Number(document.getElementById("Su_value").value)
//         );
    
//     soil.push(soil_horizon);

//     document.getElementById("soil_classification").value = "";
//     document.getElementById("depth").value ="";
//     document.getElementById("unit_weight").value = "";
//     document.getElementById("N_value").value = "";
//     document.getElementById("C_value").value = "";
//     document.getElementById("phi_value").value = "";
//     document.getElementById("Su_value").value = "";
// }

// function view_Layers(){
//     var table_id_Layers = document.getElementById("Layers");
//     table_id_Layers.innerHTML="<tr><th>土層分類</th><th>深度(m)</th><th>土壤單位重(tf/m)</th><th>平均N值</th><th>C</th><th>&#981;</th><th>Su</th><th>Ka</th><th>Kp</th><th>Ko</th><th>Kh</th></tr>"
//     for( var i=0; i<soil.length; i++){
//         var tr = document.createElement("tr");
//         table_id_Layers.appendChild(tr);
//         for( var j=0; j<list_of_class.length; j++){
//             add_value = document.createElement("td");
//             add_value.textContent = soil[i][list_of_class[j]];
//             tr.appendChild(add_value);
//         }
//     }
// }



// 輸入土層參數 (新)
const soil_layer_input = document.getElementById("soil_layer_input");
for(var i=0;i<21;i++)
{
    var option = document.createElement("option");
    option.textContent =  i;
    soil_layer_input.appendChild(option);
}

soil_layer_input.addEventListener("change",function(){
    var soil_table = document.getElementById("soil_layer_table");
    // while(soil_table.firstChild){
    //     soil_table.removeChild(this.firstChild);
    // }
    soil_table.innerHTML = '';
    
    tr_first = document.createElement("tr");
    tr_first.innerHTML = "<th>土層分類</th><th>底部深度(m)</th><th>土壤單位重(tf/m)</th><th>平均N值</th><th>C</th><th>&#981;</th><th>Su</th><th>透水(U/D)</th>";
    soil_table.appendChild(tr_first);
    
    var select_value = Number(soil_layer_input.options[soil_layer_input.selectedIndex].text);
    
    for(var i=0;i<select_value;i++)
    {
        tr = document.createElement("tr");
        soil_table.appendChild(tr);

        var soil_horizon = new class_soil(
            "NA",0,0,0,0,0,0,0,0,"drain"
        );
        soil.push(soil_horizon);
        
        for(var j=0;j<8;j++)
        {   
            td = document.createElement("td");
            tr.appendChild(td);
            
            if(j==7)
            {
                select = document.createElement("select");
                select.class = i;
                select.id = list_of_class[j] + j;

                select_drain = document.createElement("option");
                select_drain.textContent = "D";
                select.appendChild(select_drain);

                select_undrain = document.createElement("option");
                select_undrain.textContent = "U";
                select.appendChild(select_undrain);

                select.addEventListener("change",function(event){
                    eval("soil[" + event.target.class + "]." + event.target.id.substring(0,(event.target.id.length - 1)) + " = \"" + event.target.value + "\"" );
                    soil[event.target.class].recall();
                });
                td.appendChild(select);
            }
            else{
                input_soil = document.createElement("input");
                input_soil.class = i;
                input_soil.id = list_of_class[j] + j;
                input_soil.addEventListener("change",function(event){
                    if(isNaN(event.target.value))
                    {
                        eval("soil[" + event.target.class + "]." + event.target.id.substring(0,(event.target.id.length - 1)) + " = \"" + event.target.value + "\"" );
                    }else{
                        eval("soil[" + event.target.class + "]." + event.target.id.substring(0,(event.target.id.length - 1)) + " = " + event.target.value );
                    }
                    soil[event.target.class].recall();
                });
                td.appendChild(input_soil);
            }
        }
    }
})

var bugle_arr = [];


// 要拿掉 測試用
ex_load = 1.5;

// 輸入開挖層數
const exca_steps_input = document.getElementById("exca_steps_input");
for(var i=0;i<21;i++)
{
    var option = document.createElement("option");
    option.textContent =  i;
    exca_steps_input.appendChild(option);
}

var steps_arr = [];
var selected_value;

exca_steps_input.addEventListener("change",function(){
    var exca_table = document.getElementById("exca_step_table");
    
    // 先清空所有子元素
    while (exca_table.firstChild) {
        exca_table.removeChild(exca_table.firstChild);
    }
    
    var select_value = Number(exca_steps_input.options[exca_steps_input.selectedIndex].text);
    selected_value = select_value;
    
    var tr_th = document.createElement("tr");
    exca_table.appendChild(tr_th);

    th = document.createElement("th");
    th.textContent = "開挖階段";
    tr_th.appendChild(th);
    
    for(var i=0;i<select_value;i++)
    {
        th = document.createElement("th");
        th.textContent = i+1;
        tr_th.appendChild(th);
    }

    var tr_td = document.createElement("tr");
    exca_table.appendChild(tr_td);

    td = document.createElement("td");
    td.textContent = "深度";
    tr_td.appendChild(td);

    for(var i=0;i<select_value;i++)
    {   
        td = document.createElement("td");
        tr_td.appendChild(td);

        // 取得select值
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
        input_steps = document.createElement("input");
        input_steps.id = i+1;
        input_steps.addEventListener("change",function(event){
            if(isNaN(event.target.value)){
                window.alert("開挖階段請輸入深度!!");                
            }else{
                if(steps_arr.length > Number(event.target.id)-1)
                {
                    steps_arr[Number(event.target.id)-1].step = Number(event.target.id),
                    steps_arr[Number(event.target.id)-1].step_depth = Number(event.target.value)
                }else{
                    var new_step_data = new exca_steps(
                        Number(event.target.id),
                        Number(event.target.value)
                    );
                    steps_arr.push(new_step_data);
                }
            }
        });
        td.appendChild(input_steps);
    }
})


//隆起 function (bulge inspection function)

function M_R_bugle_inspection(RW_height){
    bugle_arr = [];
    var radius = RW_height - last_support;
    var last_support_soil_layer = soil.findIndex(value => value.depth > last_support);
    var height_for_bugle = 0;
    var theta_for_cal;

    // 以10/30業師講義照規律性分階段計算
    // 第一階段 1
    height_for_bugle = height_for_bugle + soil[last_support_soil_layer].depth-last_support;
    theta_for_cal = Math.asin(height_for_bugle/radius);

    var bulge_para = new bulge_parameter(
        radius,
        soil[last_support_soil_layer].depth-last_support,
        soil[last_support_soil_layer].Su,
        Math.asin(height_for_bugle/radius)        
    );
    
    bugle_arr.push(bulge_para);
    
    // 第二階段 234
    var for_soil_more_then_RW = soil.length;
    for( var i=last_support_soil_layer+1;i<soil.length;i++){

        let block_height = soil[i].depth;
        
        if(RW_height<=soil[i].depth)
        {
            block_height = RW_height;
            for_soil_more_then_RW = i;
        }else if(RW_height>=soil[i].depth && i==soil.length-1)
        {
            block_height = RW_height;
        };

        height_for_bugle = height_for_bugle + block_height - soil[i-1].depth;

        bulge_para = new bulge_parameter(
            radius,
            block_height-soil[i-1].depth,
            soil[i].Su,
            Math.asin(height_for_bugle/radius)-theta_for_cal
        );

        theta_for_cal = Math.asin(height_for_bugle/radius);
        bugle_arr.push(bulge_para);

        if(RW_height<=soil[i].depth){ i = soil.length; };
    }

    // 第三階段 567
    for( var i=for_soil_more_then_RW-1;i>last_support_soil_layer;i--){
        
        let block_height = soil[i].depth;
        
        if(RW_height>=soil[i].depth && i==soil.length-1)
        {
            block_height = RW_height;
        };

        height_for_bugle = height_for_bugle - (block_height-soil[i-1].depth);

        bulge_para = new bulge_parameter(
            radius,
            block_height-soil[i-1].depth,
            soil[i].Su,
            (Math.PI-Math.asin(height_for_bugle/radius)-theta_for_cal)
        );

        theta_for_cal = Math.PI-Math.asin(height_for_bugle/radius);
        bugle_arr.push(bulge_para);
    }

    //第四階段 8
    bulge_para = new bulge_parameter(
        radius,
        excavation_depth-last_support,
        soil[last_support_soil_layer].Su,
        (Math.PI-Math.asin((excavation_depth-last_support)/radius)-theta_for_cal)
    );

    bugle_arr.push(bulge_para);

    let sum_torque = 0;
    bugle_arr.forEach(value => { sum_torque = sum_torque + value.torque;});

    let M_resist = radius*sum_torque;

    return M_resist;
    // document.getElementById("bulge").innerHTML = last_support_soil_layer;
}

function M_D_bugle_inspection(RW_height){
    var radius = RW_height - last_support;
    var upper_soil_above_excavation = soil.findIndex(value => value.depth > excavation_depth);
    var total_upper_soil_weight = 0;

    for(var i=0;i<upper_soil_above_excavation;i++)
    {
        if(i==0)
        {
            total_upper_soil_weight = total_upper_soil_weight + (soil[i].unit_weight*(soil[i].depth));
        }else if(i==upper_soil_above_excavation)
        {
            total_upper_soil_weight = total_upper_soil_weight + (soil[i].unit_weight*(excavation_depth-soil[i-1].depth));
        }else
        {
            total_upper_soil_weight = total_upper_soil_weight + (soil[i].unit_weight*(soil[i].depth-soil[i-1].depth));
        };
    }

    let M_d = (ex_load+total_upper_soil_weight)*radius/2;
    
    return M_d;
}

function bugle_inspection(){
    var failurer = 0;
    var breaker = 0;
    var RW_WALL_Height = 1.7*excavation_depth;
    var Su_is_not_exist = 0;

    for(var i = 0;i<soil.length;i++)
    {
        if(soil[i].Su == 0)
        {
            Su_is_not_exist = Su_is_not_exist + 1; 
        }
    }

    if(Su_is_not_exist < soil.length)
    {
        do
        {
            if((M_R_bugle_inspection(RW_WALL_Height)/M_D_bugle_inspection(RW_WALL_Height)>=1.2) && (failurer == 1))
            {
                RW_WALL_Height = Math.round(RW_WALL_Height);
                breaker = 1;
            }else if(M_R_bugle_inspection(RW_WALL_Height)/M_D_bugle_inspection(RW_WALL_Height)>=1.2)
            {
                RW_WALL_Height = RW_WALL_Height - 0.5;
            }else
            {
                RW_WALL_Height = RW_WALL_Height + 0.5;
                failurer = 1;
            };
        }while(breaker == 0 );
        return RW_WALL_Height;
    }else{
        window.alert("各層參數中Su皆為0 , 無法提供剪力阻抗 , 請從新輸入");
        document.getElementById("inspection_RW_height_table").innerHTML = "請從新輸入";
        return 0;
    }
}

// 內擠 function (Internal squeeze function)

// var list_of_class = ["soil_classification", "depth", "unit_weight", "N_value", "C_value", "phi", "Su", "Ka", "Kp", "Ko", "Kh"];
// 主動土壓力 => Fa,La
var a_p_soil_arr,p_p_soil_arr;

function active_earth_pressure(RW_height){
 
    a_p_soil_arr = [];
    var last_soil_above_G_W_T = soil.findIndex(value => value.depth > G_W_T);

    if(G_W_T == 0)
    {   
        for( var i = 0; i < soil.length; i++ )
        {
            if(i == 0)
            {
                var active_p_para = new a_p_pressure(
                    0,
                    soil[i].depth,
                    0,
                    soil[i].Ka * (soil[i].unit_weight * soil[i].depth + ex_load - soil[i].depth) - 2 * soil[i].C_value * Math.sqrt(soil[i].Ka)
                );
                a_p_soil_arr.push(active_p_para);
            }else if(i == (soil.length-1) || soil[i].depth >= RW_height)
            {
                var active_p_para = new a_p_pressure(
                    soil[i-1].depth,
                    RW_height - soil[i-1].depth,
                    soil[i-1].Ka * (soil[i-1].unit_weight * soil[i-1].depth + ex_load -soil[i-1].depth) - 2 * soil[i-1].C_value * Math.sqrt(soil[i-1].Ka),
                    soil[i].Ka * (soil[i].unit_weight * RW_height + ex_load - RW_height) - 2 * soil[i].C_value * Math.sqrt(soil[i].Ka),
                );
                a_p_soil_arr.push(active_p_para);

                i = soil.length;
            }else
            {
                var active_p_para = new a_p_pressure(
                    soil[i-1].depth,
                    soil[i].depth - soil[i-1].depth,
                    soil[i-1].Ka * (soil[i-1].unit_weight * soil[i-1].depth + ex_load -soil[i-1].depth) - 2 * soil[i-1].C_value * Math.sqrt(soil[i-1].Ka),
                    soil[i].Ka * (soil[i].unit_weight * soil[i].depth + ex_load - soil[i].depth) - 2 * soil[i].C_value * Math.sqrt(soil[i].Ka),
                );
                a_p_soil_arr.push(active_p_para);
            };       
        }
    }else
    {
        // 地下水位面以上
        for(var i = 0;i < last_soil_above_G_W_T; i++)
        {   
            if(i == 0)
            {
                var active_p_para = new a_p_pressure(
                    0,
                    soil[i].depth,
                    0,
                    soil[i].Ka * (soil[i].unit_weight * soil[i].depth + ex_load) - 2 * soil[i].C_value * Math.sqrt(soil[i].Ka)
                );
                a_p_soil_arr.push(active_p_para);
            }else
            {
                var active_p_para = new a_p_pressure(
                    soil[i-1].depth,
                    soil[i].depth - soil[i-1].depth,
                    soil[i-1].Ka * (soil[i-1].unit_weight * soil[i-1].depth + ex_load) - 2 * soil[i-1].C_value * Math.sqrt(soil[i-1].Ka),
                    soil[i].Ka * (soil[i].unit_weight * soil[i].depth + ex_load) - 2 * soil[i].C_value * Math.sqrt(soil[i].Ka),
                );
                a_p_soil_arr.push(active_p_para);
            };       
        };

        // 地下水位面土壤層
        // l_i 替代 last_soil_above_G_W_T
        let l_i = last_soil_above_G_W_T

        if(l_i == 0)
        {
            var active_p_para = new a_p_pressure(
                0,
                G_W_T,
                soil[l_i].Ka * (ex_load) - 2 * soil[l_i].C_value * Math.sqrt(soil[l_i].Ka),
                soil[l_i].Ka * (soil[l_i].unit_weight * G_W_T + ex_load) - 2 * soil[l_i].C_value * Math.sqrt(soil[l_i].Ka),
            );
        }else
        {
            var active_p_para = new a_p_pressure(
                soil[l_i-1].depth,
                G_W_T - soil[l_i-1].depth,
                soil[l_i-1].Ka * (soil[l_i-1].unit_weight * soil[l_i-1].depth + ex_load) - 2 * soil[l_i-1].C_value * Math.sqrt(soil[l_i-1].Ka),
                soil[l_i].Ka * (soil[l_i].unit_weight * G_W_T + ex_load) - 2 * soil[l_i].C_value * Math.sqrt(soil[l_i].Ka),
            );
        }
        
        a_p_soil_arr.push(active_p_para);

        var active_p_para = new a_p_pressure(
            G_W_T,
            soil[l_i].depth - G_W_T,
            soil[l_i].Ka * (soil[l_i].unit_weight * G_W_T + ex_load) - 2 * soil[l_i].C_value * Math.sqrt(soil[l_i].Ka),
            soil[l_i].Ka * (soil[l_i].unit_weight * soil[l_i].depth + ex_load - soil[l_i].depth + G_W_T ) - 2 * soil[l_i].C_value * Math.sqrt(soil[l_i].Ka),
        );
        a_p_soil_arr.push(active_p_para);

        //地下水位面層以下
        for(var i = last_soil_above_G_W_T + 1; i < soil.length; i++)
        {
            if((i == soil.length - 1) || (soil[i].depth >= RW_height))
            {
                var active_p_para = new a_p_pressure(
                    soil[i-1].depth,
                    RW_height - soil[i-1].depth,
                    soil[i-1].Ka * (soil[i-1].unit_weight * soil[i-1].depth + ex_load - soil[i-1].depth + G_W_T) - 2 * soil[i-1].C_value * Math.sqrt(soil[i-1].Ka),
                    soil[i].Ka * (soil[i].unit_weight * RW_height + ex_load - RW_height + G_W_T) - 2 * soil[i].C_value * Math.sqrt(soil[i].Ka),
                );
                a_p_soil_arr.push(active_p_para);

                i = soil.length;
            }else{
                var active_p_para = new a_p_pressure(
                    soil[i-1].depth,
                    soil[i].depth - soil[i-1].depth,
                    soil[i-1].Ka * (soil[i-1].unit_weight * soil[i-1].depth + ex_load - soil[i-1].depth + G_W_T) - 2 * soil[i-1].C_value * Math.sqrt(soil[i-1].Ka),
                    soil[i].Ka * (soil[i].unit_weight * soil[i].depth + ex_load - soil[i].depth + G_W_T) - 2 * soil[i].C_value * Math.sqrt(soil[i].Ka),
                );
                a_p_soil_arr.push(active_p_para);
            }
        }
    }

    var Fa = 0;
    var La = 0;
    var La_cal = 0;


    for(var i = 0; i < a_p_soil_arr.length; i++)
    {
        Fa = Fa + a_p_soil_arr[i].Pa;

        if(i == a_p_soil_arr.length-1)
        {
            La_cal = La_cal + a_p_soil_arr[i].centroid_posi * a_p_soil_arr[i].Pa;
            La = La_cal/Fa;
        }else
        {
            La_cal = La_cal + a_p_soil_arr[i].centroid_posi * a_p_soil_arr[i].Pa;
        }
    }

    La = La - last_support;

    if(Fa*La<0)
    {
        return 0;
    }else
    {
        return Fa*La;
    }    
}

function passive_earth_pressure(RW_height){
    
    p_p_soil_arr = [];
    var excavation_soil_level = soil.findIndex(value => value.depth > excavation_depth);

    if(excavation_soil_level == soil.length)
    {
        var passive_p_para = new a_p_pressure(
            excavation_depth,
            RW_height - excavation_depth,
            soil[excavation_soil_level].Kp * (soil[excavation_soil_level].unit_weight * excavation_depth + ex_load) + 2 * soil[excavation_soil_level].C_value * Math.sqrt(soil[excavation_soil_level].Kp),
            soil[excavation_soil_level].Kp * (soil[excavation_soil_level].unit_weight * RW_height + ex_load - RW_height + excavation_depth) + 2 * soil[excavation_soil_level].C_value * Math.sqrt(soil[excavation_soil_level].Kp),
        );
        p_p_soil_arr.push(passive_p_para);
    }
    else
    {   
        for(var i = excavation_soil_level; i < soil.length; i++)
        {
            if(i == excavation_soil_level)
            {
                var passive_p_para = new a_p_pressure(
                    excavation_depth,
                    soil[excavation_soil_level].depth - excavation_depth,
                    soil[excavation_soil_level].Kp * (soil[excavation_soil_level].unit_weight * excavation_depth + ex_load) + 2 * soil[excavation_soil_level].C_value * Math.sqrt(soil[excavation_soil_level].Kp),
                    soil[excavation_soil_level].Kp * (soil[excavation_soil_level].unit_weight * soil[excavation_soil_level].depth + ex_load - soil[excavation_soil_level].depth + excavation_depth) + 2 * soil[excavation_soil_level].C_value * Math.sqrt(soil[excavation_soil_level].Kp),
                );
                p_p_soil_arr.push(passive_p_para);
            }
            else if(i == soil.length-1 || soil[i].depth >= RW_height)
            {
                var passive_p_para = new a_p_pressure(
                    soil[i-1].depth,
                    RW_height - soil[i-1].depth,
                    soil[i-1].Kp * (soil[i-1].unit_weight * soil[i-1].depth + ex_load - soil[i-1].depth + excavation_depth) + 2 * soil[i-1].C_value * Math.sqrt(soil[i-1].Kp),
                    soil[i].Kp * (soil[i].unit_weight * RW_height + ex_load - RW_height + excavation_depth) + 2 * soil[i].C_value * Math.sqrt(soil[i].Kp),
                );
                p_p_soil_arr.push(passive_p_para);

                i = soil.length;
            }else{
                var passive_p_para = new a_p_pressure(
                    soil[i-1].depth,
                    soil[i].depth - soil[i-1].depth,
                    soil[i-1].Kp * (soil[i-1].unit_weight * soil[i-1].depth + ex_load - soil[i-1].depth + excavation_depth) + 2 * soil[i-1].C_value * Math.sqrt(soil[i-1].Kp),
                    soil[i].Kp * (soil[i].unit_weight * soil[i].depth + ex_load - soil[i].depth + excavation_depth) + 2 * soil[i].C_value * Math.sqrt(soil[i].Kp),
                );
                p_p_soil_arr.push(passive_p_para);
            }       
        }
    }

    var Fp = 0;
    var Lp_cal = 0;
    var Lp = 0;

    for(var i=0 ; i < p_p_soil_arr.length; i++)
    {
        Fp = Fp + p_p_soil_arr[i].Pa;

        if(i == p_p_soil_arr.length-1)
        {
            Lp_cal = Lp_cal + p_p_soil_arr[i].centroid_posi * p_p_soil_arr[i].Pa;
            Lp = Lp_cal/Fp;
        }else
        {
            Lp_cal = Lp_cal + p_p_soil_arr[i].centroid_posi * p_p_soil_arr[i].Pa;
        }
    }

    Lp = Lp - last_support;

    return Fp*Lp;
}

function Internal_squeeze_inspection()
{
    var failurer = 0;
    var success = 0;
    var RW_WALL_Height = 1.7*excavation_depth;

// 進度到這 檢驗內外計算的值是否正確 應該不太可能連續壁小於 0 也可以過

    do
    {
        // console.log(passive_earth_pressure(RW_WALL_Height));
        // console.log(active_earth_pressure(RW_WALL_Height));
        // console.log(RW_WALL_Height);
        
        if(active_earth_pressure(RW_WALL_Height) == 0)
        {
            success = 1;
            failurer = 1;
        }

        if(passive_earth_pressure(RW_WALL_Height)>=active_earth_pressure(RW_WALL_Height))
        {
            RW_WALL_Height = RW_WALL_Height - 0.5;
            success = 1;
        }else
        {   
            RW_WALL_Height = RW_WALL_Height + 0.5;
            failurer = 1; 
        }

        console.log(RW_WALL_Height);
    }while( success == 0 || failurer == 0);

    return RW_WALL_Height;
}

//砂湧 function (Shayong inspection function)




// 上舉 function (Up for inspection function)

const up_for = document.getElementById("up_for_button");

up_for.addEventListener("click",function(){
    // 最大水壓力
    const inner_pressure = document.getElementById("max_pressure");

    inner_pressure.innerHTML = "各開挖階段可容許最大水壓力";
    var up_for_table = document.getElementById("up_for_max_pressure") ;
    
    while(up_for_table.firstChild){
        up_for_table.removeChild(up_for_table.firstChild);
    }
    
    if(steps_arr.length < selected_value)
    {
        window.alert('請先輸入完開挖各階段深度');
    }else
    {
        var tr_1 = document.createElement("tr");
        up_for_table.appendChild(tr_1);

        for(var i=0;i<selected_value+2;i++)
        {   
            if(i<2)
            {
                th = document.createElement("th");
                tr_1.appendChild(th);
            }else
            {
                th = document.createElement("th");
                th.textContent = i-1;
                tr_1.appendChild(th);
            }
        }
        
        var tr_2 = document.createElement("tr");
        up_for_table.appendChild(tr_2);

        for(var i=0;i<selected_value+2;i++)
        {   
            if(i==0)
            {
                th = document.createElement("th");
                th.textContent = "土壤編號";
                tr_2.appendChild(th);
            }else if(i==1)
            {
                th = document.createElement("th");
                th.textContent = "深度(m)";
                tr_2.appendChild(th);
            }      
            else
            {  
                th = document.createElement("th");
                th.textContent = steps_arr[i-2].step_depth;
                tr_2.appendChild(th);
                
            }
        }

        var Undrained_layer = [];
        for(var i=0;i<soil.length;i++)
        {
            if(soil[i].drain_or_not == "U")
            {
                Undrained_layer.push(i);
            }
        }

        for(var i=0;i<soil.length;i++)
        {
            tr_soil = document.createElement("tr");
            up_for_table.appendChild(tr_soil);

            for(var j=0;j<selected_value+2;j++)
            {
                if(j==0)
                {
                    th = document.createElement("th");
                    th.textContent = i+1;
                    tr_soil.appendChild(th);
                }else if(j==1)
                {
                    th = document.createElement("th");
                    th.textContent = soil[i].depth;
                    tr_soil.appendChild(th);
                }else
                {   
                    th = document.createElement("th");
                    if((Undrained_layer.includes(i)) && (soil[i].depth > steps_arr[j-2].step_depth) && (soil[i].depth > G_W_T))
                    {   
                        var max_pressure = 0;
                        for(var k=0;k<i+1;k++)
                        {
                            if(k==0)
                            {
                                max_pressure = max_pressure + (soil[k].depth - steps_arr[j-2].step_depth) * soil[k].unit_weight;
                            }else{
                                max_pressure = max_pressure + (soil[k].depth - soil[k-1].depth) * soil[k].unit_weight;
                            }
                        }
                        max_pressure = Math.round((max_pressure / 1.2)*100)/100;

                        th.textContent = max_pressure;
                    }else{
                        th.textContent = "---";
                    }                    
                    tr_soil.appendChild(th);
                }
                
            }            
        }
    }
    const inner_inspection = document.getElementById("inspection");
    inner_inspection.innerHTML = "各開挖階段無考慮設計抽降水之安全係數";
    
    var up_for_inspection = document.getElementById("up_for_max_inspection");

    while(up_for_inspection.firstChild){
        up_for_inspection.removeChild(up_for_inspection.firstChild);
    }

    if(steps_arr.length < selected_value)
    {
        window.alert('請先輸入完開挖各階段深度');
    }else{
        var tr_1 = document.createElement("tr");
        up_for_inspection.appendChild(tr_1);

        for(var i=0;i<selected_value+2;i++)
        {   
            if(i<2)
            {
                th = document.createElement("th");
                tr_1.appendChild(th);
            }else
            {
                th = document.createElement("th");
                th.textContent = i-1;
                tr_1.appendChild(th);
            }
        }
        
        var tr_2 = document.createElement("tr");
        up_for_inspection.appendChild(tr_2);

        for(var i=0;i<selected_value+2;i++)
        {   
            if(i==0)
            {
                th = document.createElement("th");
                th.textContent = "土壤編號";
                tr_2.appendChild(th);
            }else if(i==1)
            {
                th = document.createElement("th");
                th.textContent = "深度(m)";
                tr_2.appendChild(th);
            }      
            else
            {  
                th = document.createElement("th");
                th.textContent = steps_arr[i-2].step_depth;
                tr_2.appendChild(th);
            }
        }

        var Undrained_layer = [];
        for(var i=0;i<soil.length;i++)
        {
            if(soil[i].drain_or_not == "U")
            {
                Undrained_layer.push(i);
            }
        }

        for(var i=0;i<soil.length;i++)
        {
            tr_soil = document.createElement("tr");
            up_for_inspection.appendChild(tr_soil);

            for(var j=0;j<selected_value+2;j++)
            {
                if(j==0)
                {
                    th = document.createElement("th");
                    th.textContent = i+1;
                    tr_soil.appendChild(th);
                }else if(j==1)
                {
                    th = document.createElement("th");
                    th.textContent = soil[i].depth;
                    tr_soil.appendChild(th);
                }else
                {   
                    th = document.createElement("th");
                    if((Undrained_layer.includes(i)) && (soil[i].depth > steps_arr[j-2].step_depth) && (soil[i].depth > G_W_T))
                    {   
                        var inspection = 0;
                        for(var k=0;k<i+1;k++)
                        {
                            if(k==0)
                            {
                                inspection = inspection + (soil[k].depth - steps_arr[j-2].step_depth) * soil[k].unit_weight;
                            }else{
                                inspection = inspection + (soil[k].depth - soil[k-1].depth) * soil[k].unit_weight;
                            }
                        }
                        inspection = Math.round((inspection / (soil[i].depth - G_W_T))*100)/100;

                        // if(inspection<1.2)
                        // {
                        //     th.
                        // }
                        
                        th.textContent = inspection;
                    }else{
                        th.textContent = "---";
                    }                    
                    tr_soil.appendChild(th);
                }
                
            }            
        }
    }
})

//砂涌檢核

function quick_sand(RW_height,num){

    var exca_soil_level = soil.findIndex(value => value.depth > steps_arr[num].step_depth)

    var gamma_sub = Math.round((soil[exca_soil_level].unit_weight - 1))*100/100;
    var D = Math.round((RW_height - steps_arr[num].step_depth)*100)/100;
    var delta_water_pressure = 0;
    
    if((steps_arr[num].step_depth - G_W_T) <= 0)
    {
        gamma_sub = -1;
    }else{
        delta_water_pressure = Math.round((steps_arr[num].step_depth - G_W_T))*100/100;
    }
    
    var terzaghi = Math.round(2*gamma_sub*D/(1*delta_water_pressure)*100)/100;
    var critical_hydraulic_gradient = Math.round(gamma_sub*(delta_water_pressure+2*D)/(1*delta_water_pressure)*100)/100;
    
    return [gamma_sub,D,delta_water_pressure,terzaghi,critical_hydraulic_gradient];
}

function check_last_step(){
    
    var RW_WALL_Height = 1.7*excavation_depth;
    var failurer = 0;
    var last_call = "situ_d";
    var out = 0;

    do{
        var data_list = quick_sand(RW_WALL_Height,soil.findIndex(value => value.depth > steps_arr[steps_arr.length - 1].step_depth));
        
        if(data_list[3]<1.5||data_list[4]<2.0)
        {
            RW_WALL_Height = RW_WALL_Height + 0.5;
            if(last_call == "a")
            {
                out = 1;
            }
        }else if(data_list[3]>=1.5 && data_list[4]>=2.0)
        {
            RW_WALL_Height = RW_WALL_Height -0.5;
            last_call = "situ_a"
        }else{
            RW_WALL_Height = RW_WALL_Height + 0.5;
            if(last_call == "a")
            {
                out = 1;
            }
        }
    }while( out == 1 );
    
    return RW_WALL_Height;
}

const cal_wall_height = document.getElementById("cal_wall_height");

cal_wall_height.addEventListener("change",function(event){
    var rw_height = event.target.value;
    var gamma_sub_arr = [];
    var D_arr =[];
    var delta_water_pressure_arr =[];
    var terzaghi_arr = [];
    var critical_hydraulic_gradient_arr =[];

    for(var i=0;i<steps_arr.length;i++)
    {
        var quick_sand_data = quick_sand(rw_height,i);
        if(quick_sand_data[0]==-1)
        {
            gamma_sub_arr.push("---");
            D_arr.push("---");
            delta_water_pressure_arr.push("---");
            terzaghi_arr.push("---");
            critical_hydraulic_gradient_arr.push("---");
        }else
        {
            gamma_sub_arr.push(quick_sand_data[0]);
            D_arr.push(quick_sand_data[1]);
            delta_water_pressure_arr.push(quick_sand_data[2]);
            terzaghi_arr.push(quick_sand_data[3]);
            critical_hydraulic_gradient_arr.push(quick_sand_data[4]);
        }
    }

    list_of_quick_sand = ["gamma_sub","D","水頭差","terzaghi安全係數","臨界水力坡降安全係數"];

    const quick_sand_table = document.getElementById("quick_sand_table");

    while (quick_sand_table.firstChild) {
        quick_sand_table.removeChild(quick_sand_table.firstChild);
    }

    // 1
    var tr_step_level = document.createElement("tr");
    quick_sand_table.appendChild(tr_step_level);
    for(var i=0;i<steps_arr.length+1;i++)
    {   
        var th = document.createElement("th");
        if(i==0){
            th.textContent = "開挖階段";
        }else
        {
            th.textContent = i;
        }
        tr_step_level.appendChild(th);
    }
    // 2
    var tr_step_depth = document.createElement("tr");
    quick_sand_table.appendChild(tr_step_depth);
    for(var i = 0;i<steps_arr.length+1;i++)
    {
        var th = document.createElement("th");
        if(i==0){
            th.textContent = "開挖深度";
        }else
        {
            th.textContent = steps_arr[i-1].step_depth;
        }
        tr_step_depth.appendChild(th);
    }
    // 3
    var tr_gamma = document.createElement("tr");
    quick_sand_table.appendChild(tr_gamma);
    for(var i = 0;i<steps_arr.length+1;i++)
    {
        var th = document.createElement("th");
        if(i==0){
            th.textContent = "gamma_sub";
        }else
        {
            th.textContent = gamma_sub_arr[i-1];
        }
        tr_gamma.appendChild(th);
    }
    // 4
    var tr_D = document.createElement("tr");
    quick_sand_table.appendChild(tr_D);
    for(var i = 0;i<steps_arr.length+1;i++)
    {
        var th = document.createElement("th");
        if(i==0){
            th.textContent = "D";
        }else
        {
            th.textContent = D_arr[i-1];
        }
        tr_D.appendChild(th);
    }
    // 5
    var tr_delta_water_pressure = document.createElement("tr");
    quick_sand_table.appendChild(tr_delta_water_pressure);
    for(var i = 0;i<steps_arr.length+1;i++)
    {
        var th = document.createElement("th");
        if(i==0){
            th.textContent = "水壓變化";
        }else
        {
            th.textContent = delta_water_pressure_arr[i-1];
        }
        tr_delta_water_pressure.appendChild(th);
    }
    // 6
    var tr_terzaghi = document.createElement("tr");
    quick_sand_table.appendChild(tr_terzaghi);
    for(var i = 0;i<steps_arr.length+1;i++)
    {
        var th = document.createElement("th");
        if(i==0){
            th.textContent = "terzaghi安全係數";
        }else
        {
            th.textContent = terzaghi_arr[i-1];
        }
        tr_terzaghi.appendChild(th);
    }
    // 7
    var tr_critical_hydraulic_gradient = document.createElement("tr");
    quick_sand_table.appendChild(tr_critical_hydraulic_gradient);
    for(var i = 0;i<steps_arr.length+1;i++)
    {
        var th = document.createElement("th");
        if(i==0){
            th.textContent = "臨界水力坡降安全係數";
        }else
        {
            th.textContent = critical_hydraulic_gradient_arr[i-1];
        }
        tr_critical_hydraulic_gradient.appendChild(th);
    }
})
























const  inspection_wall_height = document.getElementById("wall_height");

inspection_wall_height.addEventListener("click",function(){

    const wall_height_table = document.getElementById("inspection_RW_height_table");
    
    while(wall_height_table.firstChild){
        wall_height_table.removeChild(wall_height_table.firstChild);
    }

    var list_of_inspection = ["內擠","隆起","砂涌"];
    var list_of_data = [Internal_squeeze_inspection(),bugle_inspection(),check_last_step()];

    // console.log(Internal_squeeze_inspection());
    // console.log(bugle_inspection());
    // console.log(check_last_step());

    for(var i=0;i<list_of_inspection.length;i++)
    {
        var tr = document.createElement("tr");
        wall_height_table.appendChild(tr);

        var th_1 = document.createElement("th");
        th_1.textContent = list_of_inspection[i];
        tr.appendChild(th_1);

        var th_2 = document.createElement("th");
        th_2.textContent = list_of_data[i];
        tr.appendChild(th_2);
    }
    var cal_wall_height = document.getElementById("cal_wall_height");
    cal_wall_height.value = list_of_data[2];
    const event = new Event("change");
    cal_wall_height.dispatchEvent(event);
})


// function 順序  隆起 砂湧 內擠 (上舉放額外(最後))








// 測試 是否成功存入用
// function show_person() {
//     console.log(soil[0].Ka);
//     console.log(soil[0].Kp);
//     console.log(soil[0].Ko);
//     console.log(soil[0].Kh);
//     console.log(list_of_class);
// }

//將變數寫到網頁上
// document.write(soil_property)

// document.getElementById("soil_property").innerHTML = soil_property;

