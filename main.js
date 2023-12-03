// var sand_arr = ['SF','SM','GP-GM','GP','SM-ML']
var clay_arr = ['CL','ML']

class class_soil{
    constructor(soil_classification, depth, unit_weight, N_value, C_value, Theta_cl, Alpha_cl, phi, Su, Ka, Kp, Ko, Kh){
        this.soil_classification = soil_classification;
        this.depth = depth;
        this.unit_weight = unit_weight;
        this.N_value = N_value;
        this.C_value = C_value;
        this.Theta_cl =Theta_cl;
        this.Alpha_cl =Alpha_cl;
        this.phi = phi;
        this.Su = Su;
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
        if(clay_arr.includes(soil_classification.substr(0,2))||clay_arr.includes(soil_classification)){
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

// G_W_T for ground_water_table
var Theta,Alpha,last_support,excavation_depth,G_W_T;

//soil 存土層資料
var soil = [];

// class的全部屬性
var list_of_class = ["soil_classification", "depth", "unit_weight", "N_value", "C_value", "phi", "Su", "Ka", "Kp", "Ko", "Kh"];
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

function add_soil_horizon(){
    var soil_horizon = new class_soil(
        document.getElementById("soil_classification").value,
        Number(document.getElementById("depth").value),
        Number(document.getElementById("unit_weight").value),
        Number(document.getElementById("N_value").value),
        Number(document.getElementById("C_value").value),
        Number(Theta),Number(Alpha),
        Number(document.getElementById("phi_value").value),
        Number(document.getElementById("Su_value").value)
        );
    
    soil.push(soil_horizon);

    document.getElementById("soil_classification").value = "";
    document.getElementById("depth").value ="";
    document.getElementById("unit_weight").value = "";
    document.getElementById("N_value").value = "";
    document.getElementById("C_value").value = "";
    document.getElementById("phi_value").value = "";
    document.getElementById("Su_value").value = "";
}

function view_Layers(){
    var table_id_Layers = document.getElementById("Layers");
    table_id_Layers.innerHTML="<tr><th>土層分類</th><th>深度(m)</th><th>土壤單位重(tf/m)</th><th>平均N值</th><th>C</th><th>&#981;</th><th>Su</th><th>Ka</th><th>Kp</th><th>Ko</th><th>Kh</th></tr>"
    for( var i=0; i<soil.length; i++){
        var tr = document.createElement("tr");
        table_id_Layers.appendChild(tr);
        for( var j=0; j<list_of_class.length; j++){
            add_value = document.createElement("td");
            add_value.textContent = soil[i][list_of_class[j]];
            tr.appendChild(add_value);
        }
    }
}


var bugle_arr = [];


// 要拿掉 測試用
ex_load = 1.5;

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
        document.getElementById("bulge").innerHTML = RW_WALL_Height;
    }else{
        window.alert("各層參數中Su皆為0 , 無法提供剪力阻抗 , 請從新輸入");
        document.getElementById("bulge").innerHTML = "請從新輸入";
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

        var active_p_para = new a_p_pressure(
            soil[l_i-1].depth,
            G_W_T - soil[l_i-1].depth,
            soil[l_i-1].Ka * (soil[l_i-1].unit_weight * soil[l_i-1].depth + ex_load) - 2 * soil[l_i-1].C_value * Math.sqrt(soil[l_i-1].Ka),
            soil[l_i].Ka * (soil[l_i].unit_weight * G_W_T + ex_load) - 2 * soil[l_i].C_value * Math.sqrt(soil[l_i].Ka),
        );
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
        console.log(passive_earth_pressure(RW_WALL_Height));
        console.log(active_earth_pressure(RW_WALL_Height));
        console.log(RW_WALL_Height);
        
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

    }while( success == 0 || failurer == 0);

    document.getElementById("squeeze").innerHTML = RW_WALL_Height;
}



//砂湧 function (Shayong inspection function)



// 上舉 function (Up for inspection function)



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

