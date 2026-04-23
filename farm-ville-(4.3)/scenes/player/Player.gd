extends CharacterBody2D
# ============================================================
#  Player — Di chuyển 4 hướng, tương tác, đổi tool
# ============================================================

const SPEED: float = 120.0
const TILE_SIZE: int = 32

# --- Tool hiện tại ---
enum Tool { NONE, HOE, WATERING_CAN, SEEDS, FISHING_ROD }
var current_tool: Tool = Tool.NONE
var selected_seed: String = ""

# --- Hướng nhìn ---
var facing: Vector2 = Vector2.DOWN
var is_busy: bool = false  # Khi đang mini-game câu cá, không di chuyển

# --- References ---
@onready var sprite: Sprite2D = $Sprite2D
@onready var anim: AnimationPlayer = $AnimationPlayer
@onready var interaction_area: Area2D = $InteractionArea
@onready var interaction_shape: CollisionShape2D = $InteractionArea/CollisionShape2D
@onready var tool_label: Label = $ToolLabel  # Debug: hiển thị tool đang dùng

# ---------------------------------------------------------------
func _ready() -> void:
	add_to_group("player")
	_update_interaction_area()

func _physics_process(delta: float) -> void:
	if is_busy:
		return
	_handle_movement(delta)

func _unhandled_input(event: InputEvent) -> void:
	if is_busy:
		return
	if event.is_action_pressed("interact"):
		_try_interact()
	if event.is_action_pressed("tool_1"):
		_equip_tool(Tool.HOE)
	if event.is_action_pressed("tool_2"):
		_equip_tool(Tool.WATERING_CAN)
	if event.is_action_pressed("tool_3"):
		_equip_tool(Tool.SEEDS)
	if event.is_action_pressed("tool_4"):
		_equip_tool(Tool.FISHING_ROD)

# ---------------------------------------------------------------
#  MOVEMENT
# ---------------------------------------------------------------
func _handle_movement(_delta: float) -> void:
	var dir = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	velocity = dir * SPEED

	if dir != Vector2.ZERO:
		facing = dir.normalized()
		_update_interaction_area()

		# Chọn animation theo hướng
		if abs(dir.x) > abs(dir.y):
			if dir.x > 0:
				_play_anim("walk_right")
			else:
				_play_anim("walk_left")
		else:
			if dir.y > 0:
				_play_anim("walk_down")
			else:
				_play_anim("walk_up")
	else:
		_play_idle()

	move_and_slide()

func _play_anim(anim_name: String) -> void:
	if anim.has_animation(anim_name):
		if anim.current_animation != anim_name:
			anim.play(anim_name)
	else:
		# Fallback: chỉ flip sprite nếu chưa có animation đầy đủ
		if anim_name == "walk_right":
			sprite.flip_h = false
		elif anim_name == "walk_left":
			sprite.flip_h = true

func _play_idle() -> void:
	if anim.has_animation("idle"):
		if anim.current_animation != "idle":
			anim.play("idle")

# ---------------------------------------------------------------
#  INTERACTION AREA (phía trước mặt nhân vật)
# ---------------------------------------------------------------
func _update_interaction_area() -> void:
	if not is_instance_valid(interaction_area):
		return
	interaction_area.position = facing * (TILE_SIZE * 0.75)

func _try_interact() -> void:
	# Lấy các object trong vùng tương tác
	var overlapping = interaction_area.get_overlapping_areas()
	overlapping += interaction_area.get_overlapping_bodies()

	for obj in overlapping:
		if obj.has_method("on_player_interact"):
			obj.on_player_interact(self)
			return

	# Không có object → dùng tool lên tile
	_use_tool_on_tile()

func _use_tool_on_tile() -> void:
	# Tính ô lưới phía trước
	var target_pos = global_position + facing * TILE_SIZE
	var cell = Vector2i(int(target_pos.x / TILE_SIZE), int(target_pos.y / TILE_SIZE))

	match current_tool:
		Tool.HOE:
			var farm = get_tree().get_first_node_in_group("farm_grid")
			if farm and farm.has_method("hoe_tile"):
				farm.hoe_tile(cell)
				_play_tool_anim("hoe")
		Tool.WATERING_CAN:
			var farm = get_tree().get_first_node_in_group("farm_grid")
			if farm and farm.has_method("water_tile"):
				farm.water_tile(cell)
				_play_tool_anim("water")
		Tool.SEEDS:
			if selected_seed != "":
				var farm = get_tree().get_first_node_in_group("farm_grid")
				if farm and farm.has_method("plant_seed"):
					farm.plant_seed(cell, selected_seed)
					_play_tool_anim("plant")
		Tool.FISHING_ROD:
			var fishing = get_tree().get_first_node_in_group("fishing_system")
			if fishing and fishing.has_method("try_cast"):
				fishing.try_cast(global_position + facing * TILE_SIZE)

func _play_tool_anim(tool_name: String) -> void:
	if anim.has_animation(tool_name):
		anim.play(tool_name)

# ---------------------------------------------------------------
#  TOOL SELECTION
# ---------------------------------------------------------------
func _equip_tool(tool: Tool) -> void:
	current_tool = tool
	if is_instance_valid(tool_label):
		tool_label.text = Tool.keys()[tool]
	print("[Player] Tool hiện tại: %s" % Tool.keys()[tool])

func set_busy(state: bool) -> void:
	is_busy = state
	if state:
		velocity = Vector2.ZERO

# ---------------------------------------------------------------
#  Position Helpers
# ---------------------------------------------------------------
func get_facing_cell() -> Vector2i:
	var target_pos = global_position + facing * TILE_SIZE
	return Vector2i(int(target_pos.x / TILE_SIZE), int(target_pos.y / TILE_SIZE))
