extends Control
# ============================================================
#  SettingsUI — Volume sliders, key bindings overview
# ============================================================

signal settings_closed

@onready var bgm_slider: HSlider  = $Panel/VBox/BGMRow/BGMSlider
@onready var sfx_slider: HSlider  = $Panel/VBox/SFXRow/SFXSlider
@onready var close_btn: Button    = $Panel/TopBar/CloseBtn
@onready var controls_label: RichTextLabel = $Panel/ControlsBox

const CONTROLS_TEXT = """[b]Điều Khiển[/b]
[b]WASD / Arrow Keys[/b] — Di chuyển nhân vật
[b]E[/b] — Tương tác / Dùng tool lên đất
[b]1[/b] — Trang bị Cuốc đất
[b]2[/b] — Trang bị Bình tưới nước
[b]3[/b] — Trang bị Túi hạt giống
[b]4[/b] — Trang bị Cần câu
[b]I[/b] — Mở Túi đồ
[b]B[/b] — Bật/tắt Build Mode (khi trong nhà)
[b]SPACE[/b] — Giữ thanh bar trong mini-game câu cá
[b]ESC[/b] — Hủy hành động / Đóng UI
[b]F5[/b] — Lưu game nhanh
"""

func _ready() -> void:
	bgm_slider.value = 0.7
	sfx_slider.value = 0.8
	bgm_slider.value_changed.connect(func(v): AudioManager.set_bgm_volume(v))
	sfx_slider.value_changed.connect(func(v): AudioManager.set_sfx_volume(v))
	close_btn.pressed.connect(_on_close)
	controls_label.text = CONTROLS_TEXT
	TimeManager.pause_time()

func _exit_tree() -> void:
	TimeManager.resume_time()

func _on_close() -> void:
	emit_signal("settings_closed")
	queue_free()
