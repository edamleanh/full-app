extends Node
# ============================================================
#  TimeManager — Singleton (Autoload)
#  Quản lý thời gian trong game: ngày, giờ, thời tiết
# ============================================================

signal hour_changed(hour: int)
signal day_changed(day: int)
signal weather_changed(weather: String)
signal time_of_day_changed(period: String)  # morning/afternoon/evening/night
signal day_ended

# --- Time ---
var hour: int = 6
var minute: int = 0
var day: int = 1
var time_paused: bool = false

# 1 phút game = 0.7 giây thực → 1 ngày game (24h) = 1008 giây thực (~16.8 phút)
const REAL_SECONDS_PER_GAME_MINUTE: float = 0.7
const DAY_END_HOUR: int = 24   # Midnight tự động qua ngày

var _elapsed: float = 0.0
var _current_period: String = "morning"

# --- Weather ---
var weather: String = "sunny"   # sunny / rainy / windy
const WEATHER_POOL = {
	"sunny": 0.60,
	"rainy": 0.25,
	"windy": 0.15
}

# ---------------------------------------------------------------
func _ready() -> void:
	_roll_weather()
	print("[TimeManager] Ngày %d — %02d:%02d — Thời tiết: %s" % [day, hour, minute, weather])

func _process(delta: float) -> void:
	if time_paused:
		return
	_elapsed += delta
	if _elapsed >= REAL_SECONDS_PER_GAME_MINUTE:
		_elapsed -= REAL_SECONDS_PER_GAME_MINUTE
		_tick_minute()

# ---------------------------------------------------------------
#  INTERNAL TICKS
# ---------------------------------------------------------------
func _tick_minute() -> void:
	minute += 1
	if minute >= 60:
		minute = 0
		_tick_hour()

func _tick_hour() -> void:
	hour += 1
	emit_signal("hour_changed", hour)
	var new_period = get_time_period()
	if new_period != _current_period:
		_current_period = new_period
		emit_signal("time_of_day_changed", new_period)
	if hour >= DAY_END_HOUR:
		_advance_day()

func _advance_day() -> void:
	emit_signal("day_ended")
	day += 1
	hour = 6
	minute = 0
	_roll_weather()
	emit_signal("day_changed", day)
	emit_signal("weather_changed", weather)
	print("[TimeManager] === Ngày %d bắt đầu — Thời tiết: %s ===" % [day, weather])

func _roll_weather() -> void:
	var r = randf()
	var cumulative = 0.0
	for w in WEATHER_POOL:
		cumulative += WEATHER_POOL[w]
		if r <= cumulative:
			weather = w
			return
	weather = "sunny"

# ---------------------------------------------------------------
#  PUBLIC API
# ---------------------------------------------------------------
func get_time_period() -> String:
	if hour >= 6 and hour < 12:
		return "morning"
	elif hour >= 12 and hour < 18:
		return "afternoon"
	elif hour >= 18 and hour < 22:
		return "evening"
	else:
		return "night"

func get_time_string() -> String:
	var period = "SA" if hour < 12 else "CH"
	var display_hour = hour if hour <= 12 else hour - 12
	if display_hour == 0:
		display_hour = 12
	return "%d:%02d %s" % [display_hour, minute, period]

func skip_to_next_day() -> void:
	"""Nhân vật nằm lên giường → bỏ qua đến ngày hôm sau."""
	time_paused = false
	_advance_day()

func pause_time() -> void:
	time_paused = true

func resume_time() -> void:
	time_paused = false

func get_fish_time_modifier() -> float:
	"""Tỉ lệ bonus cá hiếm dựa trên thời tiết."""
	if weather == "rainy":
		return 0.10
	return 0.0
