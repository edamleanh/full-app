## CropData — Resource chứa thông tin một loại cây trồng
class_name CropData
extends Resource

@export var id: String = ""
@export var display_name: String = ""
@export var seed_id: String = ""         # ID của hạt giống
@export var seed_buy_price: int = 20
@export var harvest_sell_price: int = 60
@export var grow_days: int = 3           # Số ngày để trưởng thành
@export var regrows: bool = false        # Cây có thể thu hoạch lại không?
@export var regrow_days: int = 0
@export var stages: int = 3             # Số giai đoạn hình ảnh khi lớn
@export var color_seed: Color = Color(0.6, 0.4, 0.2)
@export var color_sprout: Color = Color(0.4, 0.8, 0.3)
@export var color_mature: Color = Color(0.2, 0.9, 0.1)
@export var color_harvest: Color = Color(1.0, 0.8, 0.0)
@export var description: String = ""

static func make(id_: String, name_: String, seed_id_: String,
				  seed_price_: int, sell_price_: int, days_: int,
				  desc_: String = "") -> CropData:
	var c = CropData.new()
	c.id = id_
	c.display_name = name_
	c.seed_id = seed_id_
	c.seed_buy_price = seed_price_
	c.harvest_sell_price = sell_price_
	c.grow_days = days_
	c.description = desc_
	return c
