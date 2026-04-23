extends Node
# ============================================================
#  AudioManager — Singleton (Autoload)
#  Quản lý nhạc nền và hiệu ứng âm thanh
# ============================================================

# BGM players (crossfade between day/night)
var bgm_player_a: AudioStreamPlayer
var bgm_player_b: AudioStreamPlayer
var _active_bgm: AudioStreamPlayer
var _bgm_fading: bool = false

# SFX bus (polyphony via multiple players)
var sfx_players: Array[AudioStreamPlayer] = []
const SFX_POOL_SIZE = 8

# Volume settings
var bgm_volume_db: float = -10.0
var sfx_volume_db: float = -5.0

# ---------------------------------------------------------------
func _ready() -> void:
	_setup_bgm_players()
	_setup_sfx_pool()
	_connect_time_signals()
	print("[AudioManager] Sẵn sàng phát nhạc!")

func _setup_bgm_players() -> void:
	bgm_player_a = AudioStreamPlayer.new()
	bgm_player_b = AudioStreamPlayer.new()
	bgm_player_a.bus = "Music"
	bgm_player_b.bus = "Music"
	bgm_player_a.volume_db = bgm_volume_db
	bgm_player_b.volume_db = -80.0
	add_child(bgm_player_a)
	add_child(bgm_player_b)
	_active_bgm = bgm_player_a

func _setup_sfx_pool() -> void:
	for i in range(SFX_POOL_SIZE):
		var p = AudioStreamPlayer.new()
		p.bus = "SFX"
		p.volume_db = sfx_volume_db
		add_child(p)
		sfx_players.append(p)

func _connect_time_signals() -> void:
	TimeManager.time_of_day_changed.connect(_on_period_changed)
	TimeManager.weather_changed.connect(_on_weather_changed)

# ---------------------------------------------------------------
#  BGM
# ---------------------------------------------------------------
func play_bgm(stream_path: String, fade_duration: float = 2.0) -> void:
	if stream_path == "" or not ResourceLoader.exists(stream_path):
		return
	var stream = load(stream_path)
	_crossfade_bgm(stream, fade_duration)

func _crossfade_bgm(stream: AudioStream, duration: float) -> void:
	if _bgm_fading:
		return
	_bgm_fading = true

	var next = bgm_player_b if _active_bgm == bgm_player_a else bgm_player_a
	next.stream = stream
	next.play()
	next.volume_db = -80.0

	var tween = create_tween()
	tween.set_parallel(true)
	tween.tween_property(_active_bgm, "volume_db", -80.0, duration)
	tween.tween_property(next, "volume_db", bgm_volume_db, duration)
	await tween.finished

	_active_bgm.stop()
	_active_bgm = next
	_bgm_fading = false

func _on_period_changed(period: String) -> void:
	match period:
		"morning":   play_bgm("res://assets/audio/music/bgm_morning.ogg")
		"afternoon": play_bgm("res://assets/audio/music/bgm_day.ogg")
		"evening":   play_bgm("res://assets/audio/music/bgm_evening.ogg")
		"night":     play_bgm("res://assets/audio/music/bgm_night.ogg")

func _on_weather_changed(weather: String) -> void:
	if weather == "rainy":
		play_bgm("res://assets/audio/music/bgm_rain.ogg")

# ---------------------------------------------------------------
#  SFX
# ---------------------------------------------------------------
func play_sfx(stream_path: String, pitch: float = 1.0) -> void:
	if stream_path == "" or not ResourceLoader.exists(stream_path):
		return
	var player = _get_free_sfx_player()
	if not player:
		return
	player.stream = load(stream_path)
	player.pitch_scale = pitch
	player.play()

func _get_free_sfx_player() -> AudioStreamPlayer:
	for p in sfx_players:
		if not p.playing:
			return p
	return sfx_players[0]  # Reuse oldest

# ---------------------------------------------------------------
#  CONVENIENCE SFX SHORTCUTS
# ---------------------------------------------------------------
func sfx_footstep() -> void:
	play_sfx("res://assets/audio/sfx/footstep.ogg", randf_range(0.9, 1.1))

func sfx_hoe() -> void:
	play_sfx("res://assets/audio/sfx/hoe.ogg")

func sfx_water() -> void:
	play_sfx("res://assets/audio/sfx/water_pour.ogg")

func sfx_plant() -> void:
	play_sfx("res://assets/audio/sfx/plant.ogg")

func sfx_harvest() -> void:
	play_sfx("res://assets/audio/sfx/harvest.ogg")

func sfx_cast_rod() -> void:
	play_sfx("res://assets/audio/sfx/fishing_cast.ogg")

func sfx_fish_splash() -> void:
	play_sfx("res://assets/audio/sfx/splash.ogg")

func sfx_catch() -> void:
	play_sfx("res://assets/audio/sfx/catch.ogg")

func sfx_coin() -> void:
	play_sfx("res://assets/audio/sfx/coin.ogg")

func sfx_ui_click() -> void:
	play_sfx("res://assets/audio/sfx/ui_click.ogg")

# ---------------------------------------------------------------
#  VOLUME CONTROL
# ---------------------------------------------------------------
func set_bgm_volume(normalized: float) -> void:
	bgm_volume_db = linear_to_db(clamp(normalized, 0.0, 1.0))
	if _active_bgm:
		_active_bgm.volume_db = bgm_volume_db

func set_sfx_volume(normalized: float) -> void:
	sfx_volume_db = linear_to_db(clamp(normalized, 0.0, 1.0))
	for p in sfx_players:
		p.volume_db = sfx_volume_db
