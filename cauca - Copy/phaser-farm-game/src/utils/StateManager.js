// src/utils/StateManager.js
// Singleton quản lý toàn bộ trạng thái game (tiền, inventory, ngày)

import Phaser from 'phaser';

class StateManager {
    constructor() {
        this.money = 200;           // tiền bắt đầu
        this.inventory = {
            radish_seed: 5,         // hạt giống ban đầu
            carrot_seed: 2,
        };
        this.day = 1;
        this.totalEarned = 0;       // tổng tiền kiếm được (stats)
        this.events = new Phaser.Events.EventEmitter();
    }

    // ── Tiền ──────────────────────────────────────────────
    addMoney(amount) {
        this.money += amount;
        this.totalEarned += amount;
        this.events.emit('money_changed', this.money);
    }

    spendMoney(amount) {
        if (this.money < amount) return false;
        this.money -= amount;
        this.events.emit('money_changed', this.money);
        return true;
    }

    // ── Inventory ──────────────────────────────────────────
    addItem(itemId, qty = 1) {
        this.inventory[itemId] = (this.inventory[itemId] || 0) + qty;
        this.events.emit('inventory_changed', { ...this.inventory });
    }

    removeItem(itemId, qty = 1) {
        if ((this.inventory[itemId] || 0) < qty) return false;
        this.inventory[itemId] -= qty;
        if (this.inventory[itemId] <= 0) delete this.inventory[itemId];
        this.events.emit('inventory_changed', { ...this.inventory });
        return true;
    }

    hasItem(itemId, qty = 1) {
        return (this.inventory[itemId] || 0) >= qty;
    }

    // ── Ngày ──────────────────────────────────────────────
    nextDay() {
        this.day++;
        this.events.emit('day_changed', this.day);
    }

    // ── Serialization ──────────────────────────────────────
    serialize() {
        return {
            money: this.money,
            inventory: { ...this.inventory },
            day: this.day
        };
    }

    restore(data) {
        if (!data) return;
        this.money      = data.money      ?? 100;
        this.inventory  = data.inventory  ?? {};
        this.day        = data.day        ?? 1;
        this.events.emit('money_changed', this.money);
        this.events.emit('inventory_changed', { ...this.inventory });
        this.events.emit('day_changed', this.day);
    }
}

export const stateManager = new StateManager();
