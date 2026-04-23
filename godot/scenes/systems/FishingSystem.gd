extends Node2D

signal fish_caught(fish_id: String, fish_name: String, sell_price: int)
signal fishing_failed
signal fishing_started
signal fishing_cancelled

enum FishingState { IDLE, CASTING, WAITING, MINIGAME }
var state = FishingState.IDLE

var bite_timer: float = 0.0
var bite_wait_time: float = 0.0
const MIN_BITE_TIME: float = 2.0
const MAX_BITE_TIME: float = 6.0

var fish_db: Array = []

# Untyped so GDScript won't check methods/signals at parse time
var mini_game = null

func _ready() -> void:
	add_to_group("fishing_system")
	_build_fish_database()

func _process(delta: float) -> void:
	if state == FishingState.WAITING:
		bite_timer += delta
		if bite_timer >= bite_wait_time:
			_trigger_bite()

func _build_fish_database() -> void:
	fish_db = [
		{"id": "carp",         "name": "Ca Chep",     "tier": "common",    "price": 40,   "periods": ["morning"],   "weather": []},
		{"id": "goldfish",     "name": "Ca Vang",      "tier": "common",    "price": 60,   "periods": ["morning"],   "weather": []},
		{"id": "trout",        "name": "Ca Hoi Trang", "tier": "uncommon",  "price": 120,  "periods": ["morning"],   "weather": []},
		{"id": "bass",         "name": "Ca Bass",      "tier": "common",    "price": 50,   "periods": ["afternoon"], "weather": []},
		{"id": "catfish",      "name": "Ca Tre",       "tier": "uncommon",  "price": 150,  "periods": ["afternoon"], "weather": []},
		{"id": "salmon",       "name": "Ca Hoi Do",    "tier": "rare",      "price": 400,  "periods": ["afternoon"], "weather": []},
		{"id": "eel",          "name": "Ca Chinh",     "tier": "uncommon",  "price": 180,  "periods": ["evening"],   "weather": []},
		{"id": "swordfish",    "name": "Ca Kiem",      "tier": "rare",      "price": 600,  "periods": ["evening"],   "weather": []},
		{"id": "ghost_fish",   "name": "Ca Ma",        "tier": "rare",      "price": 800,  "periods": ["night"],     "weather": []},
		{"id": "electric_eel", "name": "Luon Dien",    "tier": "legendary", "price": 2500, "periods": ["night"],     "weather": ["rainy"]},
	]

func try_cast(cast_position: Vector2) -> void:
	if state != FishingState.IDLE:
		return
	state = FishingState.CASTING
	emit_signal("fishing_started")
	print("[Fishing] Cast at: ", cast_position)
	await get_tree().create_timer(0.8).timeout
	state = FishingState.WAITING
	bite_timer = 0.0
	bite_wait_time = randf_range(MIN_BITE_TIME, MAX_BITE_TIME)

func cancel_fishing() -> void:
	if state == FishingState.IDLE:
		return
	state = FishingState.IDLE
	bite_timer = 0.0
	emit_signal("fishing_cancelled")

func _trigger_bite() -> void:
	state = FishingState.MINIGAME
	var fish = _roll_fish()
	if fish.is_empty():
		_on_fishing_complete(false, {})
		return

	var mg_scene = load("res://scenes/ui/FishingMiniGame.tscn")
	if mg_scene:
		mini_game = mg_scene.instantiate()
		get_tree().current_scene.add_child(mini_game)
		# Use call() to avoid typed method check at parse time
		mini_game.call("setup", fish["name"], fish["tier"])
		mini_game.connect("completed", _on_minigame_completed.bind(fish))
		mini_game.connect("failed", _on_minigame_failed)
	else:
		_on_fishing_complete(true, fish)

func _on_minigame_completed(fish) -> void:
	_cleanup_minigame()
	_on_fishing_complete(true, fish)

func _on_minigame_failed() -> void:
	_cleanup_minigame()
	_on_fishing_complete(false, {})

func _cleanup_minigame() -> void:
	if mini_game != null and is_instance_valid(mini_game):
		mini_game.queue_free()
	mini_game = null

func _on_fishing_complete(success: bool, fish) -> void:
	state = FishingState.IDLE
	if success and fish is Dictionary and not fish.is_empty():
		GameManager.add_item(fish["id"])
		emit_signal("fish_caught", fish["id"], fish["name"], fish["price"])
	else:
		emit_signal("fishing_failed")

func _roll_fish():
	var period = TimeManager.get_time_period()
	var weather = TimeManager.weather
	var rare_bonus: float = GameManager.get_rare_chance() + TimeManager.get_fish_time_modifier()

	var eligible: Array = []
	for f in fish_db:
		if period not in f["periods"]:
			continue
		if f["weather"].size() > 0 and weather not in f["weather"]:
			continue
		eligible.append(f)

	if eligible.is_empty():
		for f in fish_db:
			if f["tier"] == "common":
				eligible.append(f)

	if eligible.is_empty():
		return {}

	var tier_weights = {
		"common":    clamp(0.70 - rare_bonus * 0.5, 0.25, 0.80),
		"uncommon":  0.20,
		"rare":      clamp(0.08 + rare_bonus * 0.6, 0.08, 0.40),
		"legendary": clamp(0.02 + rare_bonus * 0.2, 0.02, 0.15)
	}

	var by_tier = {}
	for f in eligible:
		var t = f["tier"]
		if not by_tier.has(t):
			by_tier[t] = []
		by_tier[t].append(f)

	var total_weight: float = 0.0
	for tier in by_tier.keys():
		total_weight += tier_weights.get(tier, 0.0)

	var roll: float = randf() * total_weight
	var cumulative: float = 0.0
	var chosen_tier = "common"
	for tier in by_tier.keys():
		cumulative += tier_weights.get(tier, 0.0)
		if roll <= cumulative:
			chosen_tier = tier
			break

	var pool = by_tier.get(chosen_tier, eligible)
	return pool[randi() % pool.size()]
