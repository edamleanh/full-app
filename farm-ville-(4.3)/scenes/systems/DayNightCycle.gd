extends CanvasLayer
# ============================================================
#  DayNightCycle — Visual overlay for day/night transitions
#  Modulates a dark ColorRect based on in-game hour
# ============================================================

@onready var overlay: ColorRect = $DarkOverlay
@onready var sun_moon: Label    = $SunMoon  # Emoji sun/moon indicator

# Hour → overlay alpha mapping
const HOUR_ALPHA = {
	0:  0.65,   # Midnight (darkest)
	1:  0.65,
	2:  0.65,
	3:  0.60,
	4:  0.50,
	5:  0.35,
	6:  0.05,   # Sunrise
	7:  0.00,
	8:  0.00,
	9:  0.00,
	10: 0.00,
	11: 0.00,
	12: 0.00,   # Noon (brightest)
	13: 0.00,
	14: 0.00,
	15: 0.00,
	16: 0.00,
	17: 0.05,
	18: 0.20,   # Sunset
	19: 0.35,
	20: 0.48,
	21: 0.55,
	22: 0.60,   # Night
	23: 0.63,
}

# Hour → overlay tint color
const HOUR_COLOR = {
	6:  Color(1.0, 0.7, 0.5, 1.0),   # Warm sunrise orange
	18: Color(0.8, 0.5, 0.3, 1.0),   # Warm sunset
	22: Color(0.15, 0.15, 0.4, 1.0), # Deep blue night
}

# ---------------------------------------------------------------
func _ready() -> void:
	layer = 5  # Below HUD (layer 10), above world
	TimeManager.hour_changed.connect(_on_hour_changed)
	_apply_hour(TimeManager.hour)

func _on_hour_changed(hour: int) -> void:
	_apply_hour(hour)

func _apply_hour(hour: int) -> void:
	# Interpolated alpha
	var alpha = HOUR_ALPHA.get(hour, 0.0)
	var next_alpha = HOUR_ALPHA.get((hour + 1) % 24, 0.0)

	# Get overlay color based on time period
	var base_color = _get_sky_tint(hour)
	base_color.a = alpha
	overlay.color = base_color

	# Animate smooth transition
	var tween = create_tween()
	var target_color = _get_sky_tint((hour + 1) % 24)
	target_color.a = next_alpha
	# Tween over the equivalent of 1 game-hour of real time
	var duration = TimeManager.REAL_SECONDS_PER_GAME_MINUTE * 60.0
	tween.tween_property(overlay, "color", target_color, duration)

	# Update sun/moon icon
	if hour >= 6 and hour < 18:
		sun_moon.text = "☀️"
	elif hour >= 18 and hour < 20:
		sun_moon.text = "🌅"
	else:
		sun_moon.text = "🌙"

func _get_sky_tint(hour: int) -> Color:
	if hour in HOUR_COLOR:
		return HOUR_COLOR[hour]
	elif hour >= 22 or hour < 5:
		return Color(0.05, 0.05, 0.25, 1.0)  # Night blue
	elif hour >= 18:
		return Color(0.7, 0.3, 0.2, 1.0)    # Evening orange
	elif hour <= 7:
		return Color(0.9, 0.6, 0.4, 1.0)    # Morning warm
	else:
		return Color(0.0, 0.0, 0.0, 0.0)    # Day: no tint
