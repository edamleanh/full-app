## FishData — Resource chứa thông tin một loại cá
class_name FishData
extends Resource

@export var id: String = ""
@export var display_name: String = ""
@export var tier: String = "common"      # common / uncommon / rare / legendary
@export var sell_price: int = 50
@export var spawn_periods: Array[String] = []  # morning/afternoon/evening/night
@export var spawn_weather: Array[String] = []  # [] = any, ["rainy"] = only rainy
@export var description: String = ""
@export var color: Color = Color.CYAN    # Màu placeholder khi chưa có sprite

static func make(id_: String, name_: String, tier_: String,
				  price_: int, periods_: Array,
				  weather_: Array = [], desc_: String = "") -> FishData:
	var f = FishData.new()
	f.id = id_
	f.display_name = name_
	f.tier = tier_
	f.sell_price = price_
	f.spawn_periods = periods_
	f.spawn_weather = weather_
	f.description = desc_
	return f
