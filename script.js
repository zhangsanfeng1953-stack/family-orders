const SUPABASE_URL = "https://bismoeyqlvbvcyosppvl.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z1Gh6Z55rOvjYSXzw8GhkQ_1lyTohLr";
const ORDERS_TABLE = "orders";

const dishes = [
  { name: "白切鸡", category: "招牌", method: "整鸡小火浸熟，冰水收皮，配姜葱蘸料。", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=520&q=80" },
  { name: "蜜汁叉烧", category: "烧味", method: "梅头肉腌入味，刷蜜汁烤到外焦里嫩。", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=520&q=80" },
  { name: "脆皮烧鹅", category: "烧味", method: "鹅皮风干上色，慢烤出脆皮和肉汁。", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=520&q=80" },
  { name: "豉汁蒸排骨", category: "蒸菜", method: "排骨加豆豉蒜蓉腌制，大火蒸到嫩滑。", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=520&q=80" },
  { name: "清蒸鲈鱼", category: "蒸菜", method: "鲜鱼蒸熟，淋热油和蒸鱼豉油。", image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?auto=format&fit=crop&w=520&q=80" },
  { name: "蒜蓉粉丝蒸虾", category: "海鲜", method: "虾开背铺粉丝，蒜蓉蒸香后淋汁。", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=520&q=80" },
  { name: "姜葱炒蟹", category: "海鲜", method: "蟹块先煎后炒，姜葱爆香收汁。", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=520&q=80" },
  { name: "咕噜肉", category: "肉菜", method: "炸肉块裹酸甜汁，菠萝和彩椒提香。", image: "https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=520&q=80" },
  { name: "梅菜扣肉", category: "肉菜", method: "五花肉炸皮切片，与梅菜一起蒸透。", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=520&q=80" },
  { name: "豉油鸡", category: "肉菜", method: "鸡肉用豉油卤汁慢浸，色亮味香。", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=520&q=80" },
  { name: "干炒牛河", category: "主食", method: "牛肉滑炒，河粉猛火快炒出镬气。", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=520&q=80" },
  { name: "腊味煲仔饭", category: "主食", method: "砂锅焖饭，腊肠腊肉铺面，锅巴香脆。", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=520&q=80" },
  { name: "艇仔粥", category: "粥粉", method: "白粥打底，加鱼片、花生、油条和葱花。", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=520&q=80" },
  { name: "及第粥", category: "粥粉", method: "猪杂切薄片，粥底滚熟，口感鲜滑。", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=520&q=80" },
  { name: "虾饺", category: "点心", method: "澄面皮包鲜虾馅，蒸到晶莹弹牙。", image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=520&q=80" },
  { name: "干蒸烧卖", category: "点心", method: "猪肉虾仁调馅，薄皮包好上笼蒸。", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=520&q=80" },
  { name: "萝卜糕", category: "点心", method: "萝卜丝配粘米粉蒸成糕，再煎香。", image: "https://images.unsplash.com/photo-1603079849350-1c9f6f7f4d07?auto=format&fit=crop&w=520&q=80" },
  { name: "蚝油生菜", category: "青菜", method: "生菜焯水，淋蚝油蒜蓉芡汁。", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=520&q=80" },
  { name: "白灼菜心", category: "青菜", method: "菜心焯熟，淋豉油和热油保留清甜。", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=520&q=80" },
  { name: "上汤娃娃菜", category: "青菜", method: "娃娃菜用高汤煨煮，加皮蛋火腿提鲜。", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=520&q=80" }
];

const cart = new Map();

function getEl(id) {
  return document.getElementById(id);
}

function showMessage(text, type) {
  const message = getEl("message");
  if (!message) return;
  message.textContent = text;
  message.className = "message " + (type || "");
}

function categories() {
  return ["全部", ...Array.from(new Set(dishes.map((dish) => dish.category)))];
}

function renderCategories(active = "全部") {
  const rail = getEl("categoryRail");
  if (!rail) return;
  rail.innerHTML = "";
  categories().forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button" + (category === active ? " active" : "");
    button.textContent = category;
    button.addEventListener("click", () => renderMenu(category));
    rail.appendChild(button);
  });
}

function renderMenu(active = "全部") {
  renderCategories(active);
  const grid = getEl("menuGrid");
  if (!grid) return;
  grid.innerHTML = "";
  dishes
    .filter((dish) => active === "全部" || dish.category === active)
    .forEach((dish) => {
      const card = document.createElement("article");
      card.className = "dish-card" + (cart.has(dish.name) ? " selected" : "");
      card.innerHTML = `
        <img class="dish-photo" src="${dish.image}" alt="${dish.name}" loading="lazy">
        <div class="dish-info">
          <div>
            <h3>${dish.name}</h3>
            <p>${dish.method}</p>
          </div>
          <div class="dish-bottom">
            <span class="dish-price">¥1</span>
            <button class="cart-action" type="button">${cart.has(dish.name) ? "已加入" : "加入购物车"}</button>
          </div>
        </div>
      `;
      card.querySelector(".cart-action").addEventListener("click", () => {
        if (cart.has(dish.name)) cart.delete(dish.name);
        else cart.set(dish.name, dish);
        renderMenu(active);
        renderCart();
      });
      grid.appendChild(card);
    });
}

function renderCart() {
  const cartItems = getEl("cartItems");
  const dishInput = getEl("dish_name");
  const selectedCount = getEl("selectedCount");
  const floatCount = getEl("floatCount");
  const cartTotal = getEl("cartTotal");
  const names = Array.from(cart.keys());

  if (dishInput) dishInput.value = names.join("、");
  if (selectedCount) selectedCount.textContent = names.length + " 份";
  if (floatCount) floatCount.textContent = names.length;
  if (cartTotal) cartTotal.textContent = "¥" + names.length;

  if (!cartItems) return;
  if (names.length === 0) {
    cartItems.className = "cart-items empty";
    cartItems.textContent = "还没有加入菜品";
    return;
  }

  cartItems.className = "cart-items";
  cartItems.innerHTML = "";
  names.forEach((name) => {
    const line = document.createElement("div");
    line.className = "cart-line";
    line.innerHTML = `<span>${name}</span><b>¥1</b><button type="button" aria-label="移除 ${name}">×</button>`;
    line.querySelector("button").addEventListener("click", () => {
      cart.delete(name);
      renderMenu(document.querySelector(".category-button.active")?.textContent || "全部");
      renderCart();
    });
    cartItems.appendChild(line);
  });
}

async function submitOrder(event) {
  event.preventDefault();

  const nameInput = getEl("customer_name");
  const remarkInput = getEl("remark");
  const submitButton = getEl("submitButton");
  const customer_name = nameInput.value.trim();
  const dish_name = Array.from(cart.keys()).join("、");
  const remark = remarkInput.value.trim();

  if (!customer_name) {
    showMessage("请先填写姓名。", "error");
    return;
  }

  if (!dish_name) {
    showMessage("请先把菜加入购物车。", "error");
    return;
  }

  if (!window.supabase) {
    showMessage("页面还没加载完成，请刷新后再试。", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("正在提交给厨房后台...", "");

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const { error } = await client.from(ORDERS_TABLE).insert([{
    customer_name,
    dish_name,
    remark,
    created_at: new Date().toISOString()
  }]);

  submitButton.disabled = false;

  if (error) {
    const hint = error.code === "42501" ? " 数据库权限还没放开，需要允许 orders 表插入。" : "";
    showMessage("提交失败：" + error.message + hint, "error");
    return;
  }

  showMessage("提交成功！后台已经收到点单。", "success");
  nameInput.value = "";
  remarkInput.value = "";
  cart.clear();
  renderMenu();
  renderCart();
}

window.submitOrder = submitOrder;

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCart();
  const form = getEl("orderForm");
  if (form) form.addEventListener("submit", submitOrder);
});
