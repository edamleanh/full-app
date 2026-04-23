extends Control
# ============================================================
#  InventoryUI — Túi đồ người chơi
#  Hiển thị tất cả vật phẩm trong inventory của GameManager
# ============================================================

signal inventory_closed
signal seed_selected(crop_id: String)

@onready var grid: GridContainer    = $Panel/ScrollContainer/Grid
@onready var info_name: Label       = $Panel/InfoBox/NameLabel
@onready var info_desc: Label       = $Panel/InfoBox/DescLabel
@onready var close_btn: Button      = $Panel/TopBar/CloseBtn
@onready var title_label: Label     = $Panel/TopBar/Title

# ---------------------------------------------------------------
func _ready() -> void:
	close_btn.pressed.connect(_on_close)
	GameManager.inventory_changed.connect(_refresh)
	TimeManager.pause_time()
	_refresh()

func _exit_tree() -> void:
	TimeManager.resume_time()

func _refresh() -> void:
	for child in grid.get_children():
		child.queue_free()

	if GameManager.inventory.is_empty():
		var empty_lbl = Label.new()
		empty_lbl.text = "Túi đồ trống..."
		empty_lbl.add_theme_font_size_override("font_size", 14)
		grid.add_child(empty_lbl)
		return

	for item_id in GameManager.inventory.keys():
		var qty = GameManager.inventory[item_id]
		var slot = _make_slot(item_id, qty)
		grid.add_child(slot)

func _make_slot(item_id: String, qty: int) -> Panel:
	var slot = Panel.new()
	slot.custom_minimum_size = Vector2(70, 70)

	var icon = Label.new()
	icon.text = _get_icon(item_id)
	icon.add_theme_font_size_override("font_size", 24)
	icon.position = Vector2(12, 4)
	slot.add_child(icon)

	var qty_lbl = Label.new()
	qty_lbl.text = "×%d" % qty
	qty_lbl.add_theme_font_size_override("font_size", 11)
	qty_lbl.position = Vector2(44, 50)
	slot.add_child(qty_lbl)

	# Click để chọn hạt giống
	var btn = Button.new()
	btn.anchors_preset = 15
	btn.position = Vector2(0, 0)
	btn.size = Vector2(70, 70)
	btn.flat = true
	btn.modulate.a = 0.0
	btn.pressed.connect(_on_slot_pressed.bind(item_id))
	slot.add_child(btn)

	return slot

func _on_slot_pressed(item_id: String) -> void:
	info_name.text = _get_display_name(item_id)
	info_desc.text = _get_description(item_id)

	# Nếu là hạt giống → chọn để gieo
	if item_id.begins_with("seed_"):
		var crop_id = item_id.replace("seed_", "")
		emit_signal("seed_selected", crop_id)
		_on_close()

func _on_close() -> void:
	emit_signal("inventory_closed")
	queue_free()

# ---------------------------------------------------------------
#  ITEM METADATA (đơn giản hóa — sau này dùng Resource)
# ---------------------------------------------------------------
const ITEM_ICONS = {
	"seed_turnip": "🌱", "seed_carrot": "🌱", "seed_corn": "🌱", "seed_strawberry": "🌱",
	"turnip": "🌭", "carrot": "🥕", "corn": "🌽", "strawberry": "🍓",
	"carp": "🐟", "goldfish": "🐠", "trout": "🐟", "bass": "🐟",
	"catfish": "🐟", "salmon": "🐠", "eel": "🐍", "swordfish": "⚔️",
	"ghost_fish": "👻", "electric_eel": "⚡",
	"furn_bed": "🛏", "furn_lamp": "💡", "furn_pot": "🪴",
}

const ITEM_NAMES = {
	"seed_turnip": "Hạt Củ Cải", "seed_carrot": "Hạt Cà Rốt",
	"seed_corn": "Hạt Bắp", "seed_strawberry": "Hạt Dâu Tây",
	"turnip": "Củ Cải", "carrot": "Cà Rốt", "corn": "Bắp", "strawberry": "Dâu Tây",
	"carp": "Cá Chép", "goldfish": "Cá Vàng", "trout": "Cá Hồi Trắng",
	"bass": "Cá Bass", "catfish": "Cá Trê", "salmon": "Cá Hồi Đỏ",
	"eel": "Cá Chình", "swordfish": "Cá Kiếm", "ghost_fish": "Cá Ma",
	"electric_eel": "Lươn Điện",
}

func _get_icon(id: String) -> String:
	return ITEM_ICONS.get(id, "📦")

func _get_display_name(id: String) -> String:
	return ITEM_NAMES.get(id, id)

func _get_description(id: String) -> String:
	if id.begins_with("seed_"):
		return "Hạt giống. Nhấn để chọn và gieo vào ô đất đã cuốc."
	if id in ["carp","goldfish","trout","bass","catfish","salmon","eel","swordfish","ghost_fish","electric_eel"]:
		return "Bán tại cửa hàng để kiếm tiền."
	if id in ["turnip","carrot","corn","strawberry"]:
		return "Nông sản thu hoạch được. Mang bán ở cửa hàng!"
	return ""
