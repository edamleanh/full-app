extends Control
# ============================================================
#  FishingMiniGame — Giữ thanh bar trong vùng xanh
#  Người chơi nhấn/giữ SPACE để nâng con trỏ cá lên
# ============================================================

signal completed   # Thành công → bắt cá
signal failed      # Thất bại → cá thoát

# --- Cấu hình ---
const BAR_HEIGHT: float    = 300.0   # Chiều cao thanh
const TARGET_HEIGHT: float = 60.0    # Chiều cao vùng xanh (target zone)
const CURSOR_SPEED_UP: float  = -260.0  # Tốc độ lên khi nhấn SPACE (âm = lên)
const CURSOR_SPEED_DOWN: float = 180.0  # Tốc độ rơi khi thả SPACE
const TARGET_MOVE_SPEED: float = 90.0   # Tốc độ di chuyển vùng xanh

# Điều kiện thắng
const WIN_DURATION: float   = 3.0    # Giây cần giữ con trỏ trong vùng xanh
const FAIL_TIMEOUT: float  = 10.0    # Hết thời gian → thất bại

# --- State ---
var cursor_y: float = BAR_HEIGHT / 2.0
var target_y: float = BAR_HEIGHT / 2.0
var target_dir: float = 1.0          # Hướng di chuyển vùng xanh
var win_progress: float = 0.0        # Thời gian đang ở trong vùng xanh
var elapsed: float = 0.0
var fish_name: String = ""
var fish_tier: String = "common"
var active: bool = false

# --- UI Node refs ---
@onready var bar_bg: Panel          = $BarBG
@onready var target_zone: Panel     = $BarBG/TargetZone
@onready var cursor_icon: Label     = $BarBG/CursorIcon
@onready var win_bar_fill: ColorRect = $WinBar/Fill
@onready var timer_bar_fill: ColorRect = $TimerBar/Fill
@onready var fish_label: Label      = $FishLabel
@onready var catch_label: Label     = $CatchLabel
@onready var instruction_label: Label = $InstructionLabel

# ---------------------------------------------------------------
func _ready() -> void:
	# Hiệu ứng mờ khi bắt đầu
	modulate.a = 0.0
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 1.0, 0.3)

func _process(delta: float) -> void:
	if not active:
		return

	elapsed += delta
	_move_target(delta)
	_move_cursor(delta)
	_check_win_condition(delta)
	_check_timeout()
	_update_ui()

# ---------------------------------------------------------------
#  SETUP
# ---------------------------------------------------------------
func setup(name: String, tier: String) -> void:
	fish_name = name
	fish_tier = tier
	fish_label.text = "🎣  %s" % fish_name
	cursor_y = BAR_HEIGHT / 2.0
	target_y = randf_range(TARGET_HEIGHT, BAR_HEIGHT - TARGET_HEIGHT)
	active = true

	var tier_colors = {
		"common":    Color(0.4, 0.9, 0.4),
		"uncommon":  Color(0.3, 0.6, 1.0),
		"rare":      Color(0.8, 0.3, 1.0),
		"legendary": Color(1.0, 0.7, 0.1)
	}
	target_zone.add_theme_stylebox_override("panel", _make_stylebox(tier_colors.get(tier, Color.GREEN)))

# ---------------------------------------------------------------
#  GAME LOGIC
# ---------------------------------------------------------------
func _move_target(delta: float) -> void:
	# Vùng xanh di chuyển lên xuống sine-like
	target_y += TARGET_MOVE_SPEED * target_dir * delta
	if target_y + TARGET_HEIGHT / 2 >= BAR_HEIGHT - 10:
		target_dir = -1.0
	elif target_y - TARGET_HEIGHT / 2 <= 10:
		target_dir = 1.0
	# Thêm chút ngẫu nhiên
	target_y += randf_range(-15, 15) * delta

func _move_cursor(delta: float) -> void:
	if Input.is_action_pressed("ui_accept"):  # SPACE
		cursor_y += CURSOR_SPEED_UP * delta
	else:
		cursor_y += CURSOR_SPEED_DOWN * delta
	cursor_y = clamp(cursor_y, 0.0, BAR_HEIGHT - 16.0)

func _check_win_condition(delta: float) -> void:
	var in_zone = (cursor_y >= target_y - TARGET_HEIGHT / 2 and
				   cursor_y <= target_y + TARGET_HEIGHT / 2)
	if in_zone:
		win_progress += delta
	else:
		win_progress = max(0.0, win_progress - delta * 0.5)  # Giảm chậm khi ra ngoài

	if win_progress >= WIN_DURATION:
		_win()

func _check_timeout() -> void:
	if elapsed >= FAIL_TIMEOUT:
		_lose()

func _win() -> void:
	active = false
	_show_result("✅ BẮT ĐƯỢC!", Color(0.2, 1.0, 0.4))
	await get_tree().create_timer(1.2).timeout
	emit_signal("completed")

func _lose() -> void:
	active = false
	_show_result("❌ CÁ THOÁT!", Color(1.0, 0.3, 0.3))
	await get_tree().create_timer(1.2).timeout
	emit_signal("failed")

func _show_result(text: String, color: Color) -> void:
	catch_label.text = text
	catch_label.add_theme_color_override("font_color", color)
	catch_label.visible = true
	instruction_label.visible = false
	var tween = create_tween()
	tween.tween_property(catch_label, "scale", Vector2(1.3, 1.3), 0.2)
	tween.tween_property(catch_label, "scale", Vector2(1.0, 1.0), 0.1)

# ---------------------------------------------------------------
#  UI UPDATE
# ---------------------------------------------------------------
func _update_ui() -> void:
	# Di chuyển vùng xanh
	target_zone.position.y = target_y - TARGET_HEIGHT / 2.0

	# Di chuyển con trỏ cá
	cursor_icon.position.y = cursor_y - 8.0

	# Win progress bar
	win_bar_fill.size.x = (win_progress / WIN_DURATION) * win_bar_fill.get_parent().size.x

	# Timer bar (giảm dần)
	timer_bar_fill.size.x = ((FAIL_TIMEOUT - elapsed) / FAIL_TIMEOUT) * timer_bar_fill.get_parent().size.x

func _make_stylebox(color: Color) -> StyleBoxFlat:
	var sb = StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(4)
	return sb
