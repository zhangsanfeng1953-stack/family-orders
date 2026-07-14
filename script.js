const supabaseUrl = "https://bismoeyqlvbvcyosppvl.supabase.co";

const supabaseKey = "sb_publishable_Z1Gh6Z55rOvjYSXzw8GhkQ_1lyTohLr";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

async function submitOrder() {

    const customer_name = document.getElementById("customer_name").value;
    const dish_name = document.getElementById("dish_name").value;
    const remark = document.getElementById("remark").value;

    const { error } = await supabase
        .from("orders")
        .insert([
            {
                customer_name: customer_name,
                dish_name: dish_name,
                remark: remark
            }
        ]);

    if (error) {
        document.getElementById("message").innerText =
            "提交失败：" + error.message;
    } else {
        document.getElementById("message").innerText =
            "提交成功！";
    }
}
