extends Node2D
# ============================================================
#  FishingSystem — Quản lý toàn bộ luồng câu cá
#  Cast → Chờ cắn → Mini-game → Kết quả
# ============================================================

signal fish_caught(fish_id: String, fish_name: String, sell_price: int)
signal fishing_failed
signal fishing_started
signal fishing_cancelled

# --- State machine ---
enum FishingState { IDLE, CASTING, WAITING, MINIGAME }
var state: FishingState = FishingState.IDLE

# --- Timers ---
var bite_timer: float = 0.0
var bite_wait_time: float = 0.0
const MIN_BITE_TIME: float = 2.0
const MAX_BITE_TIME: float = 6.0

# --- Fish database (10 loại cá) ---
var fish_db: Array[Dictionary] = []

# --- Mini-game reference ---
@onready var mini_game: Node = null  # Sẽ được gán khi scene load

# ---------------------------------------------------------------
func _ready() -> void:
	add_to_group("fishing_system")
	_build_fish_database()

func _process(delta: float) -> void:
	if state == FishingState.WAITING:
		bite_timer += delta
		if bite_timer >= bite_wait_time:
			_trigger_bite()

# ---------------------------------------------------------------
#  FISH DATABASE
# ---------------------------------------------------------------
func _build_fish_database() -> void:
	fish_db = [
		# { id, name, tier, price, periods, weather }
		{id="carp",         name="Cá Chép",       tier="common",    price=40,   periods=["morning"],            weather=[]},
		{id="goldfish",     name="Cá Vàng",        tier="common",    price=60,   periods=["morning"],            weather=[]},
		{id="trout",        name="Cá Hồi Trắng",   tier="uncommon",  price=120,  periods=["morning"],            weather=[]},
		{id="bass",         name="Cá Bass",        tier="common",    price=50,   periods=["afternoon"],          weather=[]},
		{id="catfish",      name="Cá Trê",         tier="uncommon",  price=150,  periods=["afternoon"],          weather=[]},
		{id="salmon",       name="Cá Hồi Đỏ",     tier="rare",      price=400,  periods=["afternoon"],          weather=[]},
		{id="eel",          name="Cá Chình",       tier="uncommon",  price=180,  periods=["evening"],            weather=[]},
		{id="swordfish",    name="Cá Kiếm",        tier="rare",      price=600,  periods=["evening"],            weather=[]},
		{id="ghost_fish",   name="Cá Ma",          tier="rare",      price=800,  periods=["night"],              weather=[]},
		{id="electric_eel", name="Lươn Điện",      tier="legendary", price=2500, periods=["night"],              weather=["rainy"]},
	]

# ---------------------------------------------------------------
#  PUBLIC: Người chơi bấm câu cá
# ---------------------------------------------------------------
func try_cast(cast_position: Vector2) -> void:
	if state != FishingState.IDLE:
		return

	# Kiểm tra xem có đứng gần nước không (đơn giản hóa: luôn cho câu)
	state = FishingState.CASTING
	emit_signal("fishing_started")
	print("[Fishing] Quăng cần tại %s..." % cast_position)

	# Sau animation cast → chuyển sang WAITING
	await get_tree().create_timer(0.8).timeout
	state = FishingState.WAITING
	bite_timer = 0.0
	bite_wait_time = randf_range(MIN_BITE_TIME, MAX_BITE_TIME)
	print("[Fishing] Đang chờ cá cắn... (%.1fs)" % bite_wait_time)

func cancel_fishing() -> void:
	if state == FishingState.IDLE:
		return
	state = FishingState.IDLE
	bite_timer = 0.0
	emit_signal("fishing_cancelled")
	print("[Fishing] Hủy câu cá.")

# ---------------------------------------------------------------
#  INTERNAL: Cá cắn câu
# ---------------------------------------------------------------
func _trigger_bite() -> void:
	state = FishingState.MINIGAME
	print("[Fishing] 🎣 Cá cắn câu!")

	# Chọn loại cá
	var fish = _roll_fish()
	if not fish:
		_on_fishing_complete(false, null)
		return

	# Mở mini-game
	var mg_scene = load("res://scenes/ui/FishingMiniGame.tscn")
	if mg_scene:
		mini_game = mg_scene.instantiate()
		get_tree().current_scene.add_child(mini_game)
		mini_game.setup(fish["name"], fish["tier"])
		mini_game.completed.connect(_on_minigame_completed.bind(fish))
		mini_game.failed.connect(_on_minigame_failed)
	else:
		# Fallback: tự động bắt cá nếu scene chưa tồn tại
		print("[Fishing] [DEBUG] Auto-catch: %s" % fish["name"])
		_on_fishing_complete(true, fish)

func _on_minigame_completed(fish: Dictionary) -> void:
	_cleanup_minigame()
	_on_fishing_complete(true, fish)

func _on_minigame_failed() -> void:
	_cleanup_minigame()
	_on_fishing_complete(false, null)

func _cleanup_minigame() -> void:
	if mini_game and is_instance_valid(mini_game):
		mini_game.queue_free()
	mini_game = null

func _on_fishing_complete(success: bool, fish: Dictionary) -> void:
	state = FishingState.IDLE
	if success and fish:
		GameManager.add_item(fish["id"])
		emit_signal("fish_caught", fish["id"], fish["name"], fish["price"])
		print("[Fishing] ✅ Bắt được: %s (%d💰)" % [fish["name"], fish["price"]])
	else:
		emit_signal("fishing_failed")
		print("[Fishing] ❌ Cá thoát mất!")

# ---------------------------------------------------------------
#  FISH SELECTION: Weighted random theo rod level & thời gian
# ---------------------------------------------------------------
func _roll_fish() -> Dictionary:
	var period = TimeManager.get_time_period()
	var weather = TimeManager.weather
	var rare_bonus = GameManager.get_rare_chance() + TimeManager.get_fish_time_modifier()

	# Lọc cá có thể xuất hiện
	var eligible: Array = []
	for f in fish_db:
		# Check thời gian
		if period not in f["periods"]:
			continue
		# Check thời tiết (nếu cần thời tiết cụ thể)
		if f["weather"].size() > 0 and weather not in f["weather"]:
			continue
		eligible.append(f)

	if eligible.is_empty():
		# Fallback: lấy cá bình thường bất kỳ
		eligible = fish_db.filter(func(f): return f["tier"] == "common")

	# Tính trọng số theo tier
	var tier_weights = {
		"common":    clamp(0.70 - rare_bonus * 0.5, 0.25, 0.80),
		"uncommon":  0.20,
		"rare":      clamp(0.08 + rare_bonus * 0.6, 0.08, 0.40),
		"legendary": clamp(0.02 + rare_bonus * 0.2, 0.02, 0.15)
	}

	# Nhóm cá theo tier
	var by_tier: Dictionary = {}
	for f in eligible:
		if not by_tier.has(f["tier"]):
			by_tier[f["tier"]] = []
		by_tier[f["tier"]].append(f)

	# Chọn tier
	var total_weight = 0.0
	for tier in by_tier.keys():
		total_weight += tier_weights.get(tier, 0.0)

	var roll = randf() * total_weight
	var cumulative = 0.0
	var chosen_tier = "common"
	for tier in by_tier.keys():
		cumulative += tier_weights.get(tier, 0.0)
		if roll <= cumulative:
			chosen_tier = tier
			break

	# Chọn ngẫu nhiên trong tier đó
	var pool = by_tier.get(chosen_tier, eligible)
	return pool[randi() % pool.size()]
