extends StaticBody2D
# ============================================================
#  ShopNPC — Nhân vật bán hàng / Thùng bán hàng
#  Người chơi đứng gần và nhấn E để mở shop
# ============================================================

var shop_open: bool = false

func _ready() -> void:
	add_to_group("interactable")

func on_player_interact(_player: CharacterBody2D) -> void:
	if shop_open:
		return
	_open_shop()

func _open_shop() -> void:
	shop_open = true
	var shop_scene = load("res://scenes/ui/ShopUI.tscn")
	if shop_scene:
		var shop = shop_scene.instantiate()
		get_tree().current_scene.add_child(shop)
		shop.shop_closed.connect(_on_shop_closed)

func _on_shop_closed() -> void:
	shop_open = false
