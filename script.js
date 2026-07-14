const SUPABASE_URL = "https://bismoeyqlvbvcyosppvl.supabase.co/rest/v1/orders";

const SUPABASE_KEY = "你的sb_publishable_key";


const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json"
};


// 提交订单
async function 提交订单() {

    const 客户姓名 = document.getElementById("name").value;
    const 菜名 = document.getElementById("food").value;
    const 备注 = document.getElementById("remark").value;


    const 数据 = {
        客户姓名: 客户姓名,
        菜名: 菜名,
        评论: 备注
    };


    const 请求 = await fetch(SUPABASE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(数据)
    });


    if (请求.ok) {
        alert("提交成功");
    } else {
        alert("提交失败");
        console.log(await 请求.text());
    }
}



// 查询订单
async function 获取订单(){

    const 请求 = await fetch(SUPABASE_URL, {
        method:"GET",
        headers:headers
    });


    const 数据 = await 请求.json();

    console.log(数据);

    return 数据;
}
