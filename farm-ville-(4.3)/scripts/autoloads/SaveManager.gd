extends Node
# ============================================================
#  SaveManager — Singleton (Autoload)
#  Lưu và tải trạng thái game vào file JSON
# ============================================================

const SAVE_PATH = "user://savegame.json"

signal game_saved
signal game_loaded

# ---------------------------------------------------------------
func save_game() -> void:
	var save_data = {
		"version": 1,
		"money": GameManager.money,
		"inventory": GameManager.inventory,
		"rod_level": GameManager.rod_level,
		"day": TimeManager.day,
		"hour": TimeManager.hour,
	}
	# Farm grid data được lưu từ FarmGrid node (nếu tồn tại)
	var farm_grid = _get_farm_grid()
	if farm_grid:
		save_data["farm_grid"] = _serialize_grid(farm_grid.grid_data)

	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(save_data, "\t"))
		file.close()
		emit_signal("game_saved")
		print("[SaveManager] Game đã lưu!")
	else:
		push_error("[SaveManager] Không thể mở file lưu!")

func load_game() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		print("[SaveManager] Không tìm thấy save file — bắt đầu game mới.")
		return false

	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if not file:
		return false

	var json_string = file.get_as_text()
	file.close()

	var data = JSON.parse_string(json_string)
	if data == null:
		push_error("[SaveManager] Lỗi đọc save file!")
		return false

	# Restore state
	GameManager.money    = data.get("money", 200)
	GameManager.inventory = data.get("inventory", {})
	GameManager.rod_level = data.get("rod_level", 1)
	TimeManager.day      = data.get("day", 1)
	TimeManager.hour     = data.get("hour", 6)

	# Restore farm grid
	var farm_grid = _get_farm_grid()
	if farm_grid and data.has("farm_grid"):
		farm_grid.grid_data = _deserialize_grid(data["farm_grid"])
		farm_grid.refresh_visuals()

	emit_signal("game_loaded")
	print("[SaveManager] Game đã tải!")
	return true

func delete_save() -> void:
	if FileAccess.file_exists(SAVE_PATH):
		DirAccess.remove_absolute(SAVE_PATH)
		print("[SaveManager] Save file đã xóa.")

# ---------------------------------------------------------------
#  HELPERS
# ---------------------------------------------------------------
func _get_farm_grid() -> Node:
	return get_tree().get_first_node_in_group("farm_grid")

func _serialize_grid(grid: Dictionary) -> Array:
	var result = []
	for cell_key in grid:
		var cell_data = grid[cell_key].duplicate()
		cell_data["cx"] = cell_key.x
		cell_data["cy"] = cell_key.y
		result.append(cell_data)
	return result

func _deserialize_grid(arr: Array) -> Dictionary:
	var result = {}
	for entry in arr:
		var key = Vector2i(entry["cx"], entry["cy"])
		var data = entry.duplicate()
		data.erase("cx")
		data.erase("cy")
		result[key] = data
	return result
