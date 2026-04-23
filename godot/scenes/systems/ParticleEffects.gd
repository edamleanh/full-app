extends Node2D
# ============================================================
#  ParticleEffects — Centralized particle spawner
#  Tạo hiệu ứng tại vị trí bất kỳ trong thế giới
# ============================================================

# Pre-created particle pools
@onready var water_pool: Array = []
@onready var harvest_pool: Array = []
@onready var splash_pool: Array = []
@onready var sparkle_pool: Array = []

const POOL_SIZE = 5

func _ready() -> void:
	add_to_group("particle_effects")
	for i in range(POOL_SIZE):
		water_pool.append(_make_water_drop())
		harvest_pool.append(_make_harvest_sparkle())
		splash_pool.append(_make_fish_splash())
		sparkle_pool.append(_make_coin_sparkle())

# ---------------------------------------------------------------
#  PUBLIC EMITTERS
# ---------------------------------------------------------------
func emit_water(world_pos: Vector2) -> void:
	var p = _get_pooled(water_pool)
	if p:
		p.global_position = world_pos
		p.emitting = true
		await get_tree().create_timer(p.lifetime + 0.1).timeout
		p.emitting = false

func emit_harvest(world_pos: Vector2) -> void:
	var p = _get_pooled(harvest_pool)
	if p:
		p.global_position = world_pos
		p.emitting = true
		await get_tree().create_timer(p.lifetime + 0.1).timeout
		p.emitting = false

func emit_fish_splash(world_pos: Vector2) -> void:
	var p = _get_pooled(splash_pool)
	if p:
		p.global_position = world_pos
		p.emitting = true
		await get_tree().create_timer(p.lifetime + 0.1).timeout
		p.emitting = false

func emit_coin(world_pos: Vector2) -> void:
	var p = _get_pooled(sparkle_pool)
	if p:
		p.global_position = world_pos
		p.emitting = true
		await get_tree().create_timer(p.lifetime + 0.1).timeout
		p.emitting = false

# ---------------------------------------------------------------
#  PARTICLE FACTORIES
# ---------------------------------------------------------------
func _make_water_drop() -> CPUParticles2D:
	var p = CPUParticles2D.new()
	p.amount = 12
	p.lifetime = 0.8
	p.one_shot = true
	p.emitting = false
	p.explosiveness = 0.9
	p.direction = Vector2(0, -1)
	p.spread = 60.0
	p.gravity = Vector2(0, 400)
	p.initial_velocity_min = 60.0
	p.initial_velocity_max = 120.0
	p.scale_amount_min = 2.0
	p.scale_amount_max = 4.0
	p.color = Color(0.4, 0.7, 1.0, 0.8)
	add_child(p)
	return p

func _make_harvest_sparkle() -> CPUParticles2D:
	var p = CPUParticles2D.new()
	p.amount = 20
	p.lifetime = 1.0
	p.one_shot = true
	p.emitting = false
	p.explosiveness = 0.85
	p.direction = Vector2(0, -1)
	p.spread = 180.0
	p.gravity = Vector2(0, 200)
	p.initial_velocity_min = 40.0
	p.initial_velocity_max = 100.0
	p.scale_amount_min = 2.0
	p.scale_amount_max = 5.0
	p.color = Color(1.0, 0.9, 0.1, 1.0)
	add_child(p)
	return p

func _make_fish_splash() -> CPUParticles2D:
	var p = CPUParticles2D.new()
	p.amount = 18
	p.lifetime = 0.7
	p.one_shot = true
	p.emitting = false
	p.explosiveness = 1.0
	p.direction = Vector2(0, -1)
	p.spread = 90.0
	p.gravity = Vector2(0, 500)
	p.initial_velocity_min = 80.0
	p.initial_velocity_max = 180.0
	p.scale_amount_min = 3.0
	p.scale_amount_max = 6.0
	p.color = Color(0.5, 0.75, 1.0, 0.7)
	add_child(p)
	return p

func _make_coin_sparkle() -> CPUParticles2D:
	var p = CPUParticles2D.new()
	p.amount = 8
	p.lifetime = 1.2
	p.one_shot = true
	p.emitting = false
	p.explosiveness = 0.8
	p.direction = Vector2(0, -1)
	p.spread = 30.0
	p.gravity = Vector2(0, 150)
	p.initial_velocity_min = 30.0
	p.initial_velocity_max = 80.0
	p.scale_amount_min = 3.0
	p.scale_amount_max = 6.0
	p.color = Color(1.0, 0.85, 0.1, 1.0)
	add_child(p)
	return p

func _get_pooled(pool: Array) -> CPUParticles2D:
	for p in pool:
		if not p.emitting:
			return p
	return pool[0]  # Fallback: reuse first
