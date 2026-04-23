extends Node
# ============================================================
#  GameManager — Singleton (Autoload)
#  Quản lý trạng thái game toàn cục: tiền, inventory, rod level
# ============================================================

signal money_changed(new_amount: int)
signal inventory_changed
signal rod_upgraded(new_level: int)
signal items_sold(total: int)

# --- Economy ---
var money: int = 200

# --- Inventory ---
# { "item_id": quantity }
var inventory: Dictionary = {}

# --- Equipment ---
var rod_level: int = 1  # 1=Wood 2=Copper 3=Iron 4=Gold

# --- Rod definitions ---
const ROD_DATA = {
	1: { "name": "Cần Câu Gỗ",   "rare_bonus": 0.00, "upgrade_cost": 0 },
	2: { "name": "Cần Câu Đồng", "rare_bonus": 0.08, "upgrade_cost": 500 },
	3: { "name": "Cần Câu Sắt",  "rare_bonus": 0.16, "upgrade_cost": 2000 },
	4: { "name": "Cần Câu Vàng", "rare_bonus": 0.24, "upgrade_cost": 8000 },
}

# ---------------------------------------------------------------
func _ready() -> void:
	print("[GameManager] Khởi động — Tiền: %d" % money)

# ---------------------------------------------------------------
#  MONEY
# ---------------------------------------------------------------
func add_money(amount: int) -> void:
	money += amount
	emit_signal("money_changed", money)

func spend_money(amount: int) -> bool:
	if money >= amount:
		money -= amount
		emit_signal("money_changed", money)
		return true
	return false  # Không đủ tiền

# ---------------------------------------------------------------
#  INVENTORY
# ---------------------------------------------------------------
func add_item(item_id: String, qty: int = 1) -> void:
	inventory[item_id] = inventory.get(item_id, 0) + qty
	emit_signal("inventory_changed")

func remove_item(item_id: String, qty: int = 1) -> bool:
	var current = inventory.get(item_id, 0)
	if current >= qty:
		inventory[item_id] = current - qty
		if inventory[item_id] == 0:
			inventory.erase(item_id)
		emit_signal("inventory_changed")
		return true
	return false

func has_item(item_id: String, qty: int = 1) -> bool:
	return inventory.get(item_id, 0) >= qty

func get_quantity(item_id: String) -> int:
	return inventory.get(item_id, 0)

# ---------------------------------------------------------------
#  FISHING ROD UPGRADES
# ---------------------------------------------------------------
func get_rare_chance() -> float:
	"""Tỉ lệ cá hiếm dựa trên cấp độ cần câu."""
	return 0.05 + ROD_DATA[rod_level]["rare_bonus"]

func upgrade_rod() -> bool:
	var next_level = rod_level + 1
	if next_level > 4:
		return false
	var cost = ROD_DATA[next_level]["upgrade_cost"]
	if spend_money(cost):
		rod_level = next_level
		emit_signal("rod_upgraded", rod_level)
		print("[GameManager] Nâng cấp cần câu lên: %s" % ROD_DATA[rod_level]["name"])
		return true
	return false

func get_rod_name() -> String:
	return ROD_DATA[rod_level]["name"]

# ---------------------------------------------------------------
#  SELLING
# ---------------------------------------------------------------
func sell_item(item_id: String, sell_price: int, qty: int = 1) -> bool:
	if remove_item(item_id, qty):
		var total = sell_price * qty
		add_money(total)
		emit_signal("items_sold", total)
		print("[GameManager] Bán %d x %s → +%d💰" % [qty, item_id, total])
		return true
	return false
