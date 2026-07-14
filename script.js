const SUPABASE_URL = "https://bismoeyqlvbvcyosppvl.supabase.co";

const SUPABASE_KEY = "sb_publishable_Z1Gh6Z55rOvjYSXzw8GhkQ_1lyTohLr";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: "Bearer " + SUPABASE_KEY,
  "Content-Type": "application/json"
};


// 提交订单
async function addOrder(order) {

  const res = await fetch(
    SUPABASE_URL + "/rest/v1/orders",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(order)
    }
  );

  const data = await res.json();

  console.log(data);
}


// 查询订单
async function getOrders(){

  const res = await fetch(
    SUPABASE_URL + "/rest/v1/orders",
    {
      headers: headers
    }
  );

  const data = await res.json();

  console.log(data);

  return data;
}
