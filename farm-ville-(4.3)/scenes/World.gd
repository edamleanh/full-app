extends Node2D
# ============================================================
#  World — Main Scene Controller
#  Kết nối tất cả các hệ thống trong thế giới game
# ============================================================

@onready var player: CharacterBody2D    = $Player
@onready var farm_grid: Node2D          = $FarmGrid
@onready var fishing_system: Node2D     = $FishingSystem
@onready var hud: CanvasLayer           = $HUD
@onready var house_room: Node2D         = $HouseRoom
@onready var particles: Node2D          = $ParticleEffects
@onready var weather: Node2D            = $WeatherSystem

var inventory_open: bool  = false
var settings_open: bool   = false
var in_house: bool        = false

# ---------------------------------------------------------------
func _ready() -> void:
	_setup_particles()
	_connect_systems()
	_try_load_game()
	print("[World] Thế giới đã khởi tạo! Ngày %d — %s" % [TimeManager.day, TimeManager.get_time_string()])

func _setup_particles() -> void:
	# Gán particle emitter vào FarmGrid để dùng khi tưới / thu hoạch
	farm_grid.set_meta("particles", particles)

# ---------------------------------------------------------------
#  SIGNAL CONNECTIONS
# ---------------------------------------------------------------
func _connect_systems() -> void:
	# Câu cá
	fishing_system.fish_caught.connect(_on_fish_caught)
	fishing_system.fishing_failed.connect(_on_fishing_failed)
	fishing_system.fishing_started.connect(func(): player.set_busy(true))
	fishing_system.fishing_cancelled.connect(func(): player.set_busy(false))

	# Ngày mới
	TimeManager.day_ended.connect(_on_day_end)
	TimeManager.weather_changed.connect(_on_weather_changed)

	# GameManager events → SFX + HUD
	GameManager.items_sold.connect(func(total):
		if particles:
			particles.emit_coin(player.global_position + Vector2(0, -20))
		AudioManager.sfx_coin()
	)

func _on_fish_caught(_fish_id: String, fish_name: String, sell_price: int) -> void:
	player.set_busy(false)
	hud.show_fish_catch(fish_name, sell_price)
	if particles:
		particles.emit_fish_splash(player.global_position + player.facing * 48.0)
	AudioManager.sfx_catch()

func _on_fishing_failed() -> void:
	player.set_busy(false)
	hud.show_notification("🌊 Cá thoát mất!", Color(0.8, 0.4, 0.2))

func _on_day_end() -> void:
	SaveManager.save_game()
	hud.show_notification("💾 Game đã lưu — Ngày %d!" % TimeManager.day, Color(0.7, 0.9, 1.0))

func _on_weather_changed(w: String) -> void:
	var msg = {"sunny": "☀️ Trời nắng hôm nay!", "rainy": "🌧️ Hôm nay trời mưa — cây được tự tưới!", "windy": "💨 Gió mạnh hôm nay!"}
	hud.show_notification(msg.get(w, ""), Color.WHITE)

func _try_load_game() -> void:
	SaveManager.load_game()

# ---------------------------------------------------------------
#  GLOBAL INPUT
# ---------------------------------------------------------------
func _unhandled_input(event: InputEvent) -> void:
	# ESC — Multi-purpose cancel
	if event.is_action_pressed("ui_cancel"):
		if in_house and house_room.build_mode:
			house_room.toggle_build_mode()
		elif inventory_open or settings_open:
			pass  # Handled by the UI itself
		else:
			fishing_system.cancel_fishing()

	# I — Inventory
	if event.is_action_pressed("inventory") and not inventory_open and not settings_open:
		_open_inventory()

	# B — Build mode (only in house)
	if event.is_action_pressed("build_mode") and in_house:
		house_room.toggle_build_mode()
		if house_room.build_mode:
			hud.show_notification("🏗️ Build Mode bật — Click để đặt đồ, R xoay, ESC thoát!", Color(0.9, 0.8, 0.3))

	# Vào nhà / ra nhà (khi đứng gần cửa)
	if event.is_action_pressed("interact"):
		_check_house_door()

	# F5 — Quick save
	if event is InputEventKey and event.pressed and event.keycode == KEY_F5:
		SaveManager.save_game()
		hud.show_notification("💾 Đã lưu!", Color(0.4, 1.0, 0.6))

	# ESC → Settings (khi không in house, không có UI mở)
	if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		if not inventory_open and not settings_open and not in_house:
			_open_settings()

# ---------------------------------------------------------------
#  HOUSE TRANSITION
# ---------------------------------------------------------------
func _check_house_door() -> void:
	var door_pos = Vector2(460, -60)   # Vị trí cửa nhà trong world
	var dist = player.global_position.distance_to(door_pos)
	if dist < 50.0:
		if in_house:
			_exit_house()
		else:
			_enter_house()

func _enter_house() -> void:
	in_house = true
	house_room.visible = true
	player.global_position = Vector2(380, -80)  # Vị trí trong nhà
	hud.show_notification("🏠 Đã vào nhà — B = Build Mode, ESC gần cửa = Ra ngoài", Color(0.9, 0.75, 0.5))

func _exit_house() -> void:
	in_house = false
	house_room.visible = false
	house_room.build_mode = false
	player.global_position = Vector2(462, -20)  # Ra ngoài cửa
	hud.show_notification("🌿 Ra ngoài!", Color(0.6, 1.0, 0.6))

# ---------------------------------------------------------------
#  UI OPENERS
# ---------------------------------------------------------------
func _open_inventory() -> void:
	inventory_open = true
	var inv = load("res://scenes/ui/Inventory.tscn").instantiate()
	add_child(inv)
	inv.inventory_closed.connect(func(): inventory_open = false)
	inv.seed_selected.connect(_on_seed_selected)

func _on_seed_selected(crop_id: String) -> void:
	player.selected_seed = crop_id
	player._equip_tool(player.Tool.SEEDS)
	hud.show_notification("🌱 Hạt %s — Nhấn E lên ô đất!" % crop_id, Color(0.5, 1.0, 0.5))

func _open_settings() -> void:
	settings_open = true
	var settings = load("res://scenes/ui/SettingsUI.tscn").instantiate()
	add_child(settings)
	settings.settings_closed.connect(func(): settings_open = false)
