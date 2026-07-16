const SUPABASE_URL = "https://bismoeyqlvbvcyosppvl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z1Gh6Z55rOvjYSXzw8GhkQ_1lyTohLr";
const ORDERS_TABLE = "orders";
const AUTO_REFRESH_MS = 10000;

let orders = [];
let client = null;
let refreshTimer = null;

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}

function splitDishes(value) {
  return String(value || "")
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatTime(value) {
  if (!value) return "时间未记录";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function filteredOrders() {
  const filter = byId("dateFilter").value;
  const keyword = byId("searchInput").value.trim().toLowerCase();
  return orders.filter((order) => {
    if (filter === "today" && !isToday(order.created_at)) return false;
    if (!keyword) return true;
    const haystack = [order.customer_name, order.dish_name, order.remark]
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword);
  });
}

function renderStats() {
  const today = orders.filter((order) => isToday(order.created_at));
  byId("todayOrders").textContent = today.length;
  byId("todayDishes").textContent = today.reduce(
    (total, order) => total + splitDishes(order.dish_name).length,
    0
  );
  byId("totalOrders").textContent = orders.length;
  byId("lastUpdated").textContent = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

function renderOrders() {
  const list = byId("ordersList");
  const visibleOrders = filteredOrders();
  list.innerHTML = "";

  if (visibleOrders.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <b>暂时没有符合条件的订单</b>
        <span>新订单提交后，这里会自动更新。</span>
      </div>`;
    return;
  }

  visibleOrders.forEach((order) => {
    const card = document.createElement("article");
    card.className = "order-card";
    const chips = splitDishes(order.dish_name)
      .map((dish) => `<span class="dish-chip">${escapeHtml(dish)}</span>`)
      .join("");
    const remark = String(order.remark || "").trim();
    card.innerHTML = `
      <div class="order-customer">
        <strong class="customer-name">${escapeHtml(order.customer_name || "未填写姓名")}</strong>
        <span class="order-id">订单 #${escapeHtml(order.id ?? "-")}</span>
      </div>
      <div class="order-dishes">
        <p class="dish-names">${chips || "<span class=\"dish-chip\">未记录菜品</span>"}</p>
      </div>
      <div class="order-remark">
        <p class="remark${remark ? "" : " empty"}">${remark ? escapeHtml(remark) : "无备注"}</p>
      </div>
      <time class="order-time" datetime="${escapeHtml(order.created_at || "")}">${formatTime(order.created_at)}</time>`;
    list.appendChild(card);
  });
}

function render() {
  renderStats();
  renderOrders();
}

async function loadOrders(manual = false) {
  const status = byId("statusMessage");
  const refreshButton = byId("refreshButton");
  if (manual) status.textContent = "正在刷新订单…";
  status.className = "status-message";
  refreshButton.disabled = true;

  try {
    const { data, error } = await client
      .from(ORDERS_TABLE)
      .select("id, customer_name, dish_name, remark, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;
    orders = data || [];
    status.textContent = "";
    render();
  } catch (error) {
    status.className = "status-message error";
    status.textContent = "读取失败：" + (error?.message || "请稍后重试");
  } finally {
    refreshButton.disabled = false;
  }
}

function startAutoRefresh() {
  clearInterval(refreshTimer);
  refreshTimer = setInterval(() => loadOrders(false), AUTO_REFRESH_MS);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.supabase) {
    byId("statusMessage").className = "status-message error";
    byId("statusMessage").textContent = "页面资源加载失败，请刷新页面。";
    return;
  }

  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  byId("refreshButton").addEventListener("click", () => loadOrders(true));
  byId("searchInput").addEventListener("input", renderOrders);
  byId("dateFilter").addEventListener("change", renderOrders);
  loadOrders(true);
  startAutoRefresh();
});

