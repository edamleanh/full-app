extends Node2D
# ============================================================
#  FarmGrid — Hệ thống lưới trồng trọt
#  Quản lý trạng thái từng ô đất: cuốc/gieo/tưới/thu hoạch
# ============================================================

const TILE_SIZE: int = 32
const FARM_ZONE_START: Vector2i = Vector2i(5, 5)   # Ô bắt đầu của khu vườn
const FARM_ZONE_END:   Vector2i = Vector2i(20, 15) # Ô kết thúc của khu vườn

# Trạng thái ô đất
enum TileState { EMPTY, TILLED, SEEDED, GROWING, READY, WILTED }

# Dict: Vector2i -> {state, crop_id, growth_day, water_today, visual_node}
var grid_data: Dictionary = {}

# Tham chiếu tới CropData database
var crop_db: Dictionary = {}  # { crop_id: CropData }

@onready var crop_container: Node2D = $CropContainer

# ---------------------------------------------------------------
func _ready() -> void:
	add_to_group("farm_grid")
	_build_crop_database()
	_connect_time_signals()
	print("[FarmGrid] Khởi động — Zone: %s → %s" % [FARM_ZONE_START, FARM_ZONE_END])

func _build_crop_database() -> void:
	# Tạo inline crop data (sau này có thể load từ .tres resources)
	var crops_raw = [
		["turnip",      "Củ Cải",    "seed_turnip",  20,   60,   3],
		["carrot",      "Cà Rốt",    "seed_carrot",  40,  130,   5],
		["corn",        "Bắp",       "seed_corn",    80,  280,   8],
		["strawberry",  "Dâu Tây",   "seed_strawberry", 150, 550, 12],
	]
	for d in crops_raw:
		var c = CropData.make(d[0], d[1], d[2], d[3], d[4], d[5])
		crop_db[d[0]] = c

# ---------------------------------------------------------------
#  TIME SIGNALS
# ---------------------------------------------------------------
func _connect_time_signals() -> void:
	TimeManager.day_changed.connect(_on_new_day)

func _on_new_day(_day: int) -> void:
	_process_growth()
	_reset_watering()

# ---------------------------------------------------------------
#  PUBLIC API
# ---------------------------------------------------------------
func hoe_tile(cell: Vector2i) -> void:
	if not _in_farm_zone(cell):
		print("[FarmGrid] Ô nằm ngoài khu vườn!")
		return
	if grid_data.has(cell):
		var state = grid_data[cell]["state"]
		if state != TileState.EMPTY:
			print("[FarmGrid] Ô đã được cuốc rồi.")
			return

	grid_data[cell] = {
		"state": TileState.TILLED,
		"crop_id": "",
		"growth_day": 0,
		"water_today": false,
		"visual_node": null
	}
	_update_visual(cell)
	AudioManager.sfx_hoe()
	print("[FarmGrid] Cuốc đất ô %s" % cell)

func plant_seed(cell: Vector2i, crop_id: String) -> bool:
	if not grid_data.has(cell):
		print("[FarmGrid] Ô chưa được cuốc!")
		return false
	var tile = grid_data[cell]
	if tile["state"] != TileState.TILLED:
		print("[FarmGrid] Ô không ở trạng thái phù hợp để gieo hạt.")
		return false
	if not crop_db.has(crop_id):
		print("[FarmGrid] Không tìm thấy cây: %s" % crop_id)
		return false

	var seed_id = crop_db[crop_id].seed_id
	if not GameManager.remove_item(seed_id):
		print("[FarmGrid] Không có hạt giống %s trong túi!" % seed_id)
		return false

	tile["state"] = TileState.SEEDED
	tile["crop_id"] = crop_id
	tile["growth_day"] = 0
	tile["water_today"] = false
	_update_visual(cell)
	AudioManager.sfx_plant()
	print("[FarmGrid] Gieo %s tại ô %s" % [crop_id, cell])
	return true

func water_tile(cell: Vector2i) -> void:
	if not grid_data.has(cell):
		return
	var tile = grid_data[cell]
	if tile["state"] in [TileState.SEEDED, TileState.GROWING, TileState.WILTED]:
		tile["water_today"] = true
		if tile["state"] == TileState.WILTED:
			tile["state"] = TileState.GROWING
		_update_visual(cell)
		# Particle + SFX
		var world_pos = Vector2(cell.x * TILE_SIZE + TILE_SIZE / 2, cell.y * TILE_SIZE) + position
		var pfx = get_tree().get_first_node_in_group("particle_effects")
		if pfx and pfx.has_method("emit_water"):
			pfx.emit_water(world_pos)
		AudioManager.sfx_water()
		print("[FarmGrid] Tưới nước ô %s" % cell)

func harvest_tile(cell: Vector2i) -> bool:
	if not grid_data.has(cell):
		return false
	var tile = grid_data[cell]
	if tile["state"] != TileState.READY:
		return false

	var crop_id = tile["crop_id"]
	var crop = crop_db[crop_id]
	GameManager.add_item(crop_id)
	print("[FarmGrid] Thu hoạch %s tại ô %s!" % [crop.display_name, cell])

	# Particle + SFX
	var world_pos = Vector2(cell.x * TILE_SIZE + TILE_SIZE / 2, cell.y * TILE_SIZE) + position
	var pfx = get_tree().get_first_node_in_group("particle_effects")
	if pfx and pfx.has_method("emit_harvest"):
		pfx.emit_harvest(world_pos)
	AudioManager.sfx_harvest()

	tile["state"] = TileState.TILLED
	tile["crop_id"] = ""
	tile["growth_day"] = 0
	tile["water_today"] = false
	_update_visual(cell)
	return true


# ---------------------------------------------------------------
#  GROWTH PROCESSING (mỗi ngày mới)
# ---------------------------------------------------------------
func _process_growth() -> void:
	for cell in grid_data.keys():
		var tile = grid_data[cell]
		match tile["state"]:
			TileState.SEEDED, TileState.GROWING:
				if tile["water_today"]:
					tile["growth_day"] += 1
					var crop = crop_db.get(tile["crop_id"])
					if crop:
						if tile["growth_day"] >= crop.grow_days:
							tile["state"] = TileState.READY
						else:
							tile["state"] = TileState.GROWING
					_update_visual(cell)
				else:
					# Không tưới → héo
					tile["state"] = TileState.WILTED
					_update_visual(cell)

func _reset_watering() -> void:
	for cell in grid_data.keys():
		grid_data[cell]["water_today"] = false

# ---------------------------------------------------------------
#  VISUAL UPDATE (Placeholder dùng ColorRect)
# ---------------------------------------------------------------
func _update_visual(cell: Vector2i) -> void:
	var tile = grid_data[cell]

	# Xóa visual cũ
	if tile["visual_node"] and is_instance_valid(tile["visual_node"]):
		tile["visual_node"].queue_free()

	var rect = ColorRect.new()
	rect.size = Vector2(TILE_SIZE - 2, TILE_SIZE - 2)
	rect.position = Vector2(cell.x * TILE_SIZE + 1, cell.y * TILE_SIZE + 1)

	match tile["state"]:
		TileState.EMPTY:
			return  # Không vẽ ô trống
		TileState.TILLED:
			rect.color = Color(0.45, 0.28, 0.12, 0.8)  # Nâu đất
		TileState.SEEDED:
			rect.color = Color(0.55, 0.38, 0.18, 0.9)
			_add_label(rect, "🌱", TILE_SIZE)
		TileState.GROWING:
			var crop = crop_db.get(tile["crop_id"])
			var progress = float(tile["growth_day"]) / max(crop.grow_days - 1, 1) if crop else 0.0
			rect.color = Color(0.3, 0.5 + progress * 0.4, 0.2, 1.0)
			_add_label(rect, "🌿", TILE_SIZE)
		TileState.READY:
			rect.color = Color(0.9, 0.8, 0.1, 1.0)  # Vàng = sẵn sàng thu hoạch
			_add_label(rect, "✨", TILE_SIZE)
		TileState.WILTED:
			rect.color = Color(0.6, 0.4, 0.2, 0.6)  # Héo
			_add_label(rect, "🥀", TILE_SIZE)

	crop_container.add_child(rect)
	tile["visual_node"] = rect

func _add_label(parent: Control, text: String, size: int) -> void:
	var lbl = Label.new()
	lbl.text = text
	lbl.add_theme_font_size_override("font_size", size - 8)
	lbl.position = Vector2(2, 0)
	parent.add_child(lbl)

func refresh_visuals() -> void:
	"""Gọi sau khi load game để render lại toàn bộ lưới."""
	for child in crop_container.get_children():
		child.queue_free()
	for cell in grid_data.keys():
		_update_visual(cell)

# ---------------------------------------------------------------
#  HELPERS
# ---------------------------------------------------------------
func _in_farm_zone(cell: Vector2i) -> bool:
	return (cell.x >= FARM_ZONE_START.x and cell.x <= FARM_ZONE_END.x and
			cell.y >= FARM_ZONE_START.y and cell.y <= FARM_ZONE_END.y)

func get_tile_state(cell: Vector2i) -> TileState:
	return grid_data[cell]["state"] if grid_data.has(cell) else TileState.EMPTY

func get_harvestable_cells() -> Array:
	var result = []
	for cell in grid_data.keys():
		if grid_data[cell]["state"] == TileState.READY:
			result.append(cell)
	return result
