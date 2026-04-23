extends CanvasLayer
# ============================================================
#  HUD — Heads-Up Display
#  Hiển thị tiền, ngày, giờ, thời tiết, hotbar tool
# ============================================================

@onready var money_label: Label    = $TopBar/MoneyLabel
@onready var day_label: Label      = $TopBar/DayLabel
@onready var time_label: Label     = $TopBar/TimeLabel
@onready var weather_label: Label  = $TopBar/WeatherLabel
@onready var tool_bar: HBoxContainer = $ToolBar
@onready var notification_label: Label = $NotificationLabel
@onready var notification_timer: Timer  = $NotificationTimer

var notification_tween: Tween = null

const WEATHER_ICONS = {
	"sunny": "☀️",
	"rainy": "🌧️",
	"windy": "💨"
}

const TOOL_NAMES = ["–", "🪛 Cuốc", "💧 Tưới", "🌱 Hạt", "🎣 Câu"]

# ---------------------------------------------------------------
func _ready() -> void:
	_connect_signals()
	_update_money(GameManager.money)
	_update_time_display()
	_update_weather(TimeManager.weather)

func _connect_signals() -> void:
	GameManager.money_changed.connect(_update_money)
	GameManager.items_sold.connect(_on_items_sold)
	GameManager.rod_upgraded.connect(_on_rod_upgraded)
	TimeManager.hour_changed.connect(_on_hour_changed)
	TimeManager.day_changed.connect(_on_day_changed)
	TimeManager.weather_changed.connect(_update_weather)

# ---------------------------------------------------------------
#  UPDATE DISPLAYS
# ---------------------------------------------------------------
func _update_money(amount: int) -> void:
	money_label.text = "💰 %d" % amount

func _update_time_display() -> void:
	time_label.text = TimeManager.get_time_string()
	day_label.text  = "Ngày %d" % TimeManager.day

func _update_weather(w: String) -> void:
	weather_label.text = WEATHER_ICONS.get(w, "?")

func _on_hour_changed(_h: int) -> void:
	_update_time_display()

func _on_day_changed(_d: int) -> void:
	_update_time_display()
	show_notification("🌅 Ngày %d bắt đầu!" % TimeManager.day)

func _on_items_sold(total: int) -> void:
	show_notification("💰 +%d" % total, Color(1.0, 0.9, 0.2))

func _on_rod_upgraded(level: int) -> void:
	show_notification("🎣 Nâng cấp: %s!" % GameManager.get_rod_name(), Color(0.3, 0.8, 1.0))

# ---------------------------------------------------------------
#  POPUP NOTIFICATION
# ---------------------------------------------------------------
func show_notification(text: String, color: Color = Color.WHITE) -> void:
	notification_label.text = text
	notification_label.add_theme_color_override("font_color", color)
	notification_label.modulate.a = 1.0
	notification_label.position.y = -40.0

	if notification_tween:
		notification_tween.kill()
	notification_tween = create_tween()
	notification_tween.tween_property(notification_label, "position:y", -80.0, 1.5)
	notification_tween.parallel().tween_property(notification_label, "modulate:a", 0.0, 1.5)

# ---------------------------------------------------------------
#  FISH CAUGHT DISPLAY
# ---------------------------------------------------------------
func show_fish_catch(fish_name: String, _sell_price: int) -> void:
	show_notification("🐟 Bắt được: %s!" % fish_name, Color(0.2, 1.0, 0.6))
