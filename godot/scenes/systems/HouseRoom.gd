extends Node2D
# ============================================================
#  HouseRoom — Hệ thống Trang Trí Nhà
#  Build mode: đặt và xóa đồ nội thất trên lưới
# ============================================================

signal furniture_placed(furniture_id: String, cell: Vector2i)
signal furniture_removed(cell: Vector2i)

const TILE_SIZE: int = 32
const ROOM_COLS: int = 12
const ROOM_ROWS: int = 8

# Lưu trạng thái nội thất: Vector2i → { furniture_id, node }
var furniture_layout: Dictionary = {}

# Build mode state
var build_mode: bool = false
var selected_furniture: String = ""
var preview_node: Node2D = null

# FurnitureData database (inline)
var furniture_db: Dictionary = {}

@onready var floor_grid: Node2D       = $FloorGrid
@onready var furniture_layer: Node2D  = $FurnitureLayer
@onready var build_ui: Control        = $BuildUI
@onready var preview_label: Label     = $BuildUI/PreviewLabel
@onready var exit_label: Label        = $ExitLabel

# ---------------------------------------------------------------
func _ready() -> void:
	add_to_group("house_room")
	_build_furniture_db()
	_draw_floor_grid()
	build_ui.visible = false

func _build_furniture_db() -> void:
	var items = [
		# id, name, price, size_x, size_y, interact_type
		["furn_bed",      "Giường Ngủ",  300,  2, 1, "sleep"],
		["furn_lamp",     "Đèn Bàn",     120,  1, 1, "toggle_light"],
		["furn_tv",       "TV",          500,  2, 1, "watch_tv"],
		["furn_pot",      "Chậu Cây",    80,   1, 1, ""],
		["furn_table",    "Bàn Gỗ",      200,  2, 1, ""],
		["furn_rug",      "Thảm",        150,  3, 2, ""],
		["furn_shelf",    "Kệ Sách",     180,  2, 1, ""],
		["furn_chest",    "Rương Đồ",    250,  1, 1, "open_chest"],
	]
	for d in items:
		furniture_db[d[0]] = FurnitureData.make(d[0], d[1], d[2], d[3], d[4], d[5] if d[5] != "" else "")

# ---------------------------------------------------------------
#  BUILD MODE
# ---------------------------------------------------------------
func toggle_build_mode() -> void:
	build_mode = not build_mode
	build_ui.visible = build_mode
	if not build_mode:
		_clear_preview()
		selected_furniture = ""
	else:
		_open_furniture_catalogue()

func _open_furniture_catalogue() -> void:
	# Xây dựng UI chọn nội thất từ inventory
	var catalogue = $BuildUI/Catalogue
	for child in catalogue.get_children():
		child.queue_free()

	for fid in furniture_db.keys():
		if not GameManager.has_item(fid):
			continue
		var btn = Button.new()
		var fd = furniture_db[fid]
		btn.text = "%s  (%dx%d)" % [fd.display_name, fd.size.x, fd.size.y]
		btn.pressed.connect(_select_furniture.bind(fid))
		catalogue.add_child(btn)

func _select_furniture(fid: String) -> void:
	selected_furniture = fid
	_clear_preview()
	preview_label.text = "Đang đặt: %s  [Nhấn R để xoay]  [ESC để hủy]" % furniture_db[fid].display_name
	# Tạo preview node
	preview_node = _make_furniture_visual(fid, true)
	add_child(preview_node)

func _input(event: InputEvent) -> void:
	if not build_mode:
		return

	if event is InputEventMouseMotion and preview_node:
		var local_pos = get_local_mouse_position()
		var cell = _pos_to_cell(local_pos)
		preview_node.position = _cell_to_pos(cell)
		# Colour preview red if occupied
		var can_place = _can_place(cell, selected_furniture)
		preview_node.modulate = Color(0.3, 1.0, 0.3, 0.6) if can_place else Color(1.0, 0.3, 0.3, 0.6)

	if event is InputEventMouseButton and event.pressed:
		var local_pos = get_local_mouse_position()
		var cell = _pos_to_cell(local_pos)

		if event.button_index == MOUSE_BUTTON_LEFT:
			if selected_furniture != "":
				_try_place(cell)
			else:
				_try_remove(cell)
		elif event.button_index == MOUSE_BUTTON_RIGHT:
			_try_remove(cell)

	if event.is_action_pressed("ui_cancel"):
		if selected_furniture != "":
			selected_furniture = ""
			_clear_preview()
		else:
			toggle_build_mode()

# ---------------------------------------------------------------
#  PLACEMENT
# ---------------------------------------------------------------
func _try_place(cell: Vector2i) -> void:
	if selected_furniture == "" or not _can_place(cell, selected_furniture):
		return
	if not GameManager.remove_item(selected_furniture):
		return

	var node = _make_furniture_visual(selected_furniture, false)
	node.position = _cell_to_pos(cell)
	furniture_layer.add_child(node)

	var fd = furniture_db[selected_furniture]
	for dx in range(fd.size.x):
		for dy in range(fd.size.y):
			furniture_layout[cell + Vector2i(dx, dy)] = {
				"furniture_id": selected_furniture,
				"node": node,
				"origin": cell
			}

	emit_signal("furniture_placed", selected_furniture, cell)
	print("[HouseRoom] Đặt %s tại ô %s" % [selected_furniture, cell])
	selected_furniture = ""
	_clear_preview()

func _try_remove(cell: Vector2i) -> void:
	if not furniture_layout.has(cell):
		return
	var origin = furniture_layout[cell]["origin"]
	var fid = furniture_layout[cell]["furniture_id"]
	var node = furniture_layout[cell]["node"]

	# Xóa tất cả ô mà đồ vật chiếm
	var fd = furniture_db.get(fid)
	if fd:
		for dx in range(fd.size.x):
			for dy in range(fd.size.y):
				furniture_layout.erase(origin + Vector2i(dx, dy))

	if node and is_instance_valid(node):
		node.queue_free()

	GameManager.add_item(fid)  # Trả item về inventory
	emit_signal("furniture_removed", cell)
	print("[HouseRoom] Dỡ %s khỏi ô %s" % [fid, cell])

func _can_place(cell: Vector2i, fid: String) -> bool:
	if not furniture_db.has(fid):
		return false
	var fd = furniture_db[fid]
	for dx in range(fd.size.x):
		for dy in range(fd.size.y):
			var check_cell = cell + Vector2i(dx, dy)
			if furniture_layout.has(check_cell):
				return false
			if not _in_room(check_cell):
				return false
	return true

# ---------------------------------------------------------------
#  FURNITURE VISUALS (Placeholder)
# ---------------------------------------------------------------
const FURNITURE_ICONS = {
	"furn_bed":   "🛏", "furn_lamp":  "💡", "furn_tv":    "📺",
	"furn_pot":   "🪴", "furn_table": "🪑", "furn_rug":   "🟥",
	"furn_shelf": "📚", "furn_chest": "🪣",
}
const FURNITURE_COLORS = {
	"furn_bed":   Color(0.6, 0.35, 0.2), "furn_lamp":  Color(1.0, 0.9, 0.5),
	"furn_tv":    Color(0.2, 0.2, 0.3),  "furn_pot":   Color(0.4, 0.65, 0.3),
	"furn_table": Color(0.55, 0.38, 0.2),"furn_rug":   Color(0.8, 0.3, 0.3),
	"furn_shelf": Color(0.4, 0.3, 0.2),  "furn_chest": Color(0.7, 0.55, 0.3),
}

func _make_furniture_visual(fid: String, is_preview: bool) -> Node2D:
	var container = Node2D.new()
	var fd = furniture_db.get(fid)
	if not fd:
		return container

	var rect = ColorRect.new()
	rect.size = Vector2(fd.size.x * TILE_SIZE - 2, fd.size.y * TILE_SIZE - 2)
	rect.position = Vector2(1, 1)
	rect.color = FURNITURE_COLORS.get(fid, Color(0.6, 0.4, 0.2))
	if is_preview:
		rect.color.a = 0.6
	container.add_child(rect)

	var icon = Label.new()
	icon.text = FURNITURE_ICONS.get(fid, "📦")
	icon.add_theme_font_size_override("font_size", 22 * fd.size.x)
	icon.position = Vector2(4, 2)
	container.add_child(icon)

	# Interact label
	if fd.can_interact and not is_preview:
		var interact_lbl = Label.new()
		interact_lbl.text = "[E]"
		interact_lbl.add_theme_font_size_override("font_size", 9)
		interact_lbl.position = Vector2(2, fd.size.y * TILE_SIZE - 14)
		container.add_child(interact_lbl)

	return container

# ---------------------------------------------------------------
#  FLOOR GRID
# ---------------------------------------------------------------
func _draw_floor_grid() -> void:
	for x in range(ROOM_COLS):
		for y in range(ROOM_ROWS):
			var rect = ColorRect.new()
			rect.size = Vector2(TILE_SIZE - 1, TILE_SIZE - 1)
			rect.position = Vector2(x * TILE_SIZE + 0.5, y * TILE_SIZE + 0.5)
			rect.color = Color(0.55, 0.42, 0.28) if (x + y) % 2 == 0 else Color(0.50, 0.38, 0.24)
			floor_grid.add_child(rect)

# ---------------------------------------------------------------
#  HELPERS
# ---------------------------------------------------------------
func _pos_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(pos.x / TILE_SIZE), int(pos.y / TILE_SIZE))

func _cell_to_pos(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * TILE_SIZE, cell.y * TILE_SIZE)

func _in_room(cell: Vector2i) -> bool:
	return cell.x >= 0 and cell.x < ROOM_COLS and cell.y >= 0 and cell.y < ROOM_ROWS

func _clear_preview() -> void:
	if preview_node and is_instance_valid(preview_node):
		preview_node.queue_free()
	preview_node = null

func get_layout_serializable() -> Array:
	var result = []
	var seen_origins = []
	for cell in furniture_layout:
		var data = furniture_layout[cell]
		if data["origin"] not in seen_origins:
			seen_origins.append(data["origin"])
			result.append({
				"fid": data["furniture_id"],
				"ox": data["origin"].x,
				"oy": data["origin"].y
			})
	return result
