extends Node2D
# ============================================================
#  WeatherSystem — Mưa / Gió / Nắng hiệu ứng hình ảnh
#  Dùng CPUParticles2D cho hiệu ứng mưa
# ============================================================

@onready var rain_particles: CPUParticles2D  = $RainParticles
@onready var wind_particles: CPUParticles2D  = $WindLeaves
@onready var weather_label: Label            = $WeatherIndicator

# ---------------------------------------------------------------
func _ready() -> void:
	TimeManager.weather_changed.connect(_apply_weather)
	TimeManager.day_changed.connect(func(_d): _apply_weather(TimeManager.weather))
	_apply_weather(TimeManager.weather)

func _apply_weather(weather: String) -> void:
	rain_particles.emitting = false
	wind_particles.emitting = false

	match weather:
		"rainy":
			rain_particles.emitting = true
			weather_label.text = "🌧️ Trời Mưa"
			weather_label.visible = true
		"windy":
			wind_particles.emitting = true
			weather_label.text = "💨 Gió Mạnh"
			weather_label.visible = true
		"sunny":
			weather_label.text = "☀️ Trời Nắng"
			weather_label.visible = false

# ---------------------------------------------------------------
#  SETUP PARTICLES (called from _ready via scene config)
# ---------------------------------------------------------------
func _setup_rain() -> void:
	rain_particles.amount = 200
	rain_particles.lifetime = 1.2
	rain_particles.direction = Vector2(0.15, 1.0)
	rain_particles.spread = 5.0
	rain_particles.gravity = Vector2(20.0, 600.0)
	rain_particles.initial_velocity_min = 300.0
	rain_particles.initial_velocity_max = 420.0
	rain_particles.scale_amount_min = 1.5
	rain_particles.scale_amount_max = 3.0
	rain_particles.color = Color(0.5, 0.65, 1.0, 0.6)
	rain_particles.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	rain_particles.emission_rect_extents = Vector2(700, 5)
	rain_particles.position = Vector2(0, -400)

func _setup_wind_leaves() -> void:
	wind_particles.amount = 30
	wind_particles.lifetime = 4.0
	wind_particles.direction = Vector2(1.0, 0.3)
	wind_particles.spread = 20.0
	wind_particles.gravity = Vector2(0, 20.0)
	wind_particles.initial_velocity_min = 60.0
	wind_particles.initial_velocity_max = 110.0
	wind_particles.angular_velocity_min = -180.0
	wind_particles.angular_velocity_max = 180.0
	wind_particles.scale_amount_min = 3.0
	wind_particles.scale_amount_max = 6.0
	wind_particles.color = Color(0.3, 0.7, 0.2, 0.8)
	wind_particles.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	wind_particles.emission_rect_extents = Vector2(5, 400)
	wind_particles.position = Vector2(-700, 0)
