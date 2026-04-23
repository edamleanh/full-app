## FurnitureData — Resource chứa thông tin đồ nội thất
class_name FurnitureData
extends Resource

@export var id: String = ""
@export var display_name: String = ""
@export var buy_price: int = 100
@export var size: Vector2i = Vector2i(1, 1)  # Kích thước tính bằng ô lưới
@export var can_interact: bool = false
@export var interact_type: String = ""       # "sleep" / "toggle_light" / "watch_tv"
@export var description: String = ""
@export var color: Color = Color(0.8, 0.6, 0.4)

static func make(id_: String, name_: String, price_: int,
				  size_x: int = 1, size_y: int = 1,
				  interact: String = "") -> FurnitureData:
	var f = FurnitureData.new()
	f.id = id_
	f.display_name = name_
	f.buy_price = price_
	f.size = Vector2i(size_x, size_y)
	if interact != "":
		f.can_interact = true
		f.interact_type = interact
	return f
