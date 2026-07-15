const SUPABASE_URL = "https://bismoeyqlvbvcyosppvl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z1Gh6Z55rOvjYSXzw8GhkQ_1lyTohLr";
const ORDERS_TABLE = "orders";

const dishes = [
  { name: "红烧肉", price: "¥28", note: "肥而不腻 · 今日推荐", emoji: "🥘" },
  { name: "宫保鸡丁", price: "¥22", note: "微辣下饭 · 热门菜", emoji: "🍗" },
  { name: "西红柿鸡蛋", price: "¥16", note: "酸甜软嫩 · 家常味", emoji: "🍅" },
  { name: "清蒸鱼", price: "¥32", note: "新鲜清淡 · 少刺", emoji: "🐟" },
  { name: "青椒肉丝", price: "¥20", note: "香辣开胃 · 下饭", emoji: "🌶️" },
  { name: "紫菜蛋花汤", price: "¥12", note: "热乎清爽 · 配餐", emoji: "🥣" }
];

const selected = new Set();

function getEl(id) {
  return document.getElementById(id);
}

function showMessage(text, type) {
  const message = getEl("message");
  if (!message) return;
  message.textContent = text;
  message.className = "message " + (type || "");
}

function refreshSelection() {
  const dishInput = getEl("dish_name");
  const selectedCount = getEl("selectedCount");
  const grid = getEl("menuGrid");
  const choices = Array.from(selected);

  if (dishInput) dishInput.value = choices.join("、");
  if (selectedCount) selectedCount.textContent = "已选 " + choices.length + " 道";
  if (grid) {
    grid.querySelectorAll(".dish-card").forEach(function(card) {
      card.classList.toggle("selected", selected.has(card.dataset.name));
    });
  }
}

function makeText(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  return node;
}

function renderMenu() {
  const grid = getEl("menuGrid");
  const select = getEl("dish_name");

  if (grid) {
    grid.innerHTML = "";
    dishes.forEach(function(dish) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "dish-card";
      card.dataset.name = dish.name;

      card.appendChild(makeText("span", "dish-art", dish.emoji));
      const body = document.createElement("span");
      body.className = "dish-body";
      body.appendChild(makeText("strong", "", dish.name));
      body.appendChild(makeText("small", "", dish.note));
      body.appendChild(makeText("b", "price", dish.price));
      card.appendChild(body);
      card.appendChild(makeText("span", "pick", "选"));

      card.addEventListener("click", function() {
        if (selected.has(dish.name)) selected.delete(dish.name);
        else selected.add(dish.name);
        refreshSelection();
      });

      grid.appendChild(card);
    });
  }

  if (select && select.tagName === "SELECT") {
    select.innerHTML = "";
    dishes.forEach(function(dish) {
      const option = document.createElement("option");
      option.value = dish.name;
      option.textContent = dish.name;
      select.appendChild(option);
    });
  }
}

async function submitOrder(event) {
  if (event) event.preventDefault();

  const nameInput = getEl("customer_name") || getEl("name");
  const dishInput = getEl("dish_name") || getEl("food");
  const remarkInput = getEl("remark") || getEl("spicy");
  const submitButton = getEl("submitButton");

  const customer_name = nameInput ? nameInput.value.trim() : "";
  let dish_name = dishInput ? dishInput.value.trim() : "";
  if (!dish_name && selected.size > 0) dish_name = Array.from(selected).join("、");
  const remark = remarkInput ? remarkInput.value.trim() : "";

  if (!customer_name) {
    showMessage("请先填写姓名。", "error");
    return;
  }

  if (!dish_name) {
    showMessage("请至少选择一道菜。", "error");
    return;
  }

  if (!window.supabase) {
    showMessage("页面还没加载完成，请刷新后再试。", "error");
    return;
  }

  if (submitButton) submitButton.disabled = true;
  showMessage("正在提交给厨房...", "loading");

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const payload = {
    customer_name: customer_name,
    dish_name: dish_name,
    remark: remark,
    created_at: new Date().toISOString()
  };

  const result = await client.from(ORDERS_TABLE).insert([payload]);

  if (submitButton) submitButton.disabled = false;

  if (result.error) {
    console.error("Supabase insert failed", result.error);
    const hint = result.error.code === "42501" ? " 数据库权限还没放开，需要给 orders 表添加允许网页插入的策略。" : "";
    showMessage("提交失败：" + result.error.message + hint, "error");
    return;
  }

  showMessage("提交成功！后台已经收到。", "success");
  if (nameInput) nameInput.value = "";
  if (remarkInput) remarkInput.value = "";
  selected.clear();
  refreshSelection();
}

window.submitOrder = submitOrder;

document.addEventListener("DOMContentLoaded", function() {
  renderMenu();
  const form = getEl("orderForm");
  if (form) form.addEventListener("submit", submitOrder);
  refreshSelection();
});
