extends Control
# ============================================================
#  ShopUI — Giao diện Mua/Bán
#  Người chơi tương tác NPC hoặc máy bán hàng để mở
# ============================================================

signal shop_closed

@onready var buy_tab_btn: Button       = $Panel/TabBar/BuyBtn
@onready var sell_tab_btn: Button      = $Panel/TabBar/SellBtn
@onready var item_list: VBoxContainer  = $Panel/ScrollContainer/ItemList
@onready var info_label: Label         = $Panel/InfoPanel/InfoLabel
@onready var money_label: Label        = $Panel/TopBar/MoneyLabel
@onready var close_btn: Button         = $Panel/TopBar/CloseBtn

enum Tab { BUY, SELL }
var current_tab: Tab = Tab.BUY

# --- Shop catalogue ---
var buy_catalogue: Array = []
var sell_catalogue: Array = []

# ---------------------------------------------------------------
func _ready() -> void:
	_build_catalogues()
	_connect_signals()
	_update_money_display()
	show_tab(Tab.BUY)
	# Dừng thời gian khi mở shop
	TimeManager.pause_time()

func _exit_tree() -> void:
	TimeManager.resume_time()

func _build_catalogues() -> void:
	buy_catalogue = [
		# Seeds
		{id="seed_turnip",      name="Hạt Củ Cải",     price=20,   type="seed",      icon="🌱"},
		{id="seed_carrot",      name="Hạt Cà Rốt",     price=40,   type="seed",      icon="🥕"},
		{id="seed_corn",        name="Hạt Bắp",        price=80,   type="seed",      icon="🌽"},
		{id="seed_strawberry",  name="Hạt Dâu Tây",    price=150,  type="seed",      icon="🍓"},
		# Fishing Rods
		{id="rod_copper",       name="Cần Câu Đồng",   price=500,  type="rod",       icon="🎣"},
		{id="rod_iron",         name="Cần Câu Sắt",    price=2000, type="rod",       icon="🎣"},
		{id="rod_gold",         name="Cần Câu Vàng",   price=8000, type="rod",       icon="🎣"},
		# Furniture
		{id="furn_bed",         name="Giường Ngủ",     price=300,  type="furniture", icon="🛏"},
		{id="furn_lamp",        name="Đèn Bàn",        price=120,  type="furniture", icon="💡"},
		{id="furn_pot",         name="Chậu Cây",       price=80,   type="furniture", icon="🪴"},
	]

	sell_catalogue = [
		# Crops
		{id="turnip",       name="Củ Cải",       price=60,   icon="🌭"},
		{id="carrot",       name="Cà Rốt",        price=130,  icon="🥕"},
		{id="corn",         name="Bắp",           price=280,  icon="🌽"},
		{id="strawberry",   name="Dâu Tây",       price=550,  icon="🍓"},
		# Fish
		{id="carp",         name="Cá Chép",       price=40,   icon="🐟"},
		{id="goldfish",     name="Cá Vàng",       price=60,   icon="🐠"},
		{id="trout",        name="Cá Hồi Trắng",  price=120,  icon="🐟"},
		{id="bass",         name="Cá Bass",       price=50,   icon="🐟"},
		{id="catfish",      name="Cá Trê",        price=150,  icon="🐟"},
		{id="salmon",       name="Cá Hồi Đỏ",    price=400,  icon="🐠"},
		{id="eel",          name="Cá Chình",      price=180,  icon="🐍"},
		{id="swordfish",    name="Cá Kiếm",       price=600,  icon="⚔️"},
		{id="ghost_fish",   name="Cá Ma",         price=800,  icon="👻"},
		{id="electric_eel", name="Lươn Điện",     price=2500, icon="⚡"},
	]

# ---------------------------------------------------------------
#  SIGNALS
# ---------------------------------------------------------------
func _connect_signals() -> void:
	buy_tab_btn.pressed.connect(func(): show_tab(Tab.BUY))
	sell_tab_btn.pressed.connect(func(): show_tab(Tab.SELL))
	close_btn.pressed.connect(_on_close)
	GameManager.money_changed.connect(func(m): money_label.text = "💰 %d" % m)

# ---------------------------------------------------------------
#  TAB MANAGEMENT
# ---------------------------------------------------------------
func show_tab(tab: Tab) -> void:
	current_tab = tab
	_clear_list()

	var catalogue = buy_catalogue if tab == Tab.BUY else sell_catalogue

	for item_data in catalogue:
		var can_afford_or_has = true
		if tab == Tab.BUY:
			can_afford_or_has = GameManager.money >= item_data["price"]
		else:
			can_afford_or_has = GameManager.has_item(item_data["id"])

		var row = _make_item_row(item_data, tab, can_afford_or_has)
		item_list.add_child(row)

func _clear_list() -> void:
	for child in item_list.get_children():
		child.queue_free()

func _make_item_row(data: Dictionary, tab: Tab, enabled: bool) -> HBoxContainer:
	var row = HBoxContainer.new()
	row.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	var icon_lbl = Label.new()
	icon_lbl.text = data.get("icon", "📦")
	icon_lbl.add_theme_font_size_override("font_size", 22)
	icon_lbl.custom_minimum_size = Vector2(32, 32)

	var name_lbl = Label.new()
	if tab == Tab.SELL:
		var qty = GameManager.get_quantity(data["id"])
		name_lbl.text = "%s  ×%d" % [data["name"], qty]
	else:
		name_lbl.text = data["name"]
	name_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	name_lbl.add_theme_font_size_override("font_size", 14)

	var price_lbl = Label.new()
	price_lbl.text = "💰%d" % data["price"]
	price_lbl.add_theme_font_size_override("font_size", 14)

	var action_btn = Button.new()
	action_btn.text = "Mua" if tab == Tab.BUY else "Bán"
	action_btn.disabled = not enabled
	action_btn.custom_minimum_size = Vector2(60, 28)

	if tab == Tab.BUY:
		action_btn.pressed.connect(_buy_item.bind(data))
	else:
		action_btn.pressed.connect(_sell_item.bind(data))

	row.add_child(icon_lbl)
	row.add_child(name_lbl)
	row.add_child(price_lbl)
	row.add_child(action_btn)
	return row

# ---------------------------------------------------------------
#  TRANSACTIONS
# ---------------------------------------------------------------
func _buy_item(data: Dictionary) -> void:
	match data.get("type", ""):
		"seed":
			if GameManager.spend_money(data["price"]):
				GameManager.add_item(data["id"])
				info_label.text = "✅ Đã mua %s!" % data["name"]
				show_tab(current_tab)  # Refresh
			else:
				info_label.text = "❌ Không đủ tiền!"
		"rod":
			if GameManager.upgrade_rod():
				info_label.text = "🎣 Cần câu đã nâng cấp!"
			else:
				info_label.text = "❌ Không thể nâng cấp!"
		"furniture":
			if GameManager.spend_money(data["price"]):
				GameManager.add_item(data["id"])
				info_label.text = "✅ Đã mua %s!" % data["name"]
				show_tab(current_tab)

func _sell_item(data: Dictionary) -> void:
	var qty = GameManager.get_quantity(data["id"])
	if qty <= 0:
		info_label.text = "❌ Không có %s trong túi!" % data["name"]
		return
	if GameManager.sell_item(data["id"], data["price"], qty):
		info_label.text = "💰 Bán %d×%s → +%d💰" % [qty, data["name"], data["price"] * qty]
		show_tab(current_tab)

func _update_money_display() -> void:
	money_label.text = "💰 %d" % GameManager.money

func _on_close() -> void:
	emit_signal("shop_closed")
	queue_free()
