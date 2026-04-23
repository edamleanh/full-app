// src/systems/TimeManager.js
// Quản lý thời gian in-game: ngày, thời tiết, progress bar

import { stateManager } from '../utils/StateManager.js';

export const Weather = {
    SUNNY:  'sunny',
    RAINY:  'rainy',
    CLOUDY: 'cloudy',
};

// 50% sunny, 25% cloudy, 25% rainy
const WEATHER_LIST = [
    Weather.SUNNY, Weather.SUNNY,
    Weather.CLOUDY,
    Weather.RAINY,
];

export default class TimeManager {
    constructor(scene, dayDurationMs = 90000) {
        this.scene          = scene;
        this.weather        = Weather.SUNNY;
        this._timer         = null;
        this._ticker        = null;
        this._dayDurationMs = dayDurationMs;
        this._elapsed       = 0;
    }

    start() {
        // Progress ticker – fires every 500ms
        this._ticker = this.scene.time.addEvent({
            delay: 500,
            callback: this._tick,
            callbackScope: this,
            loop: true,
        });
        this._scheduleNextDay();
    }

    _tick() {
        this._elapsed = Math.min(this._elapsed + 500, this._dayDurationMs);
        const progress = this._elapsed / this._dayDurationMs;
        this.scene.events.emit('time_progress', progress);
    }

    _scheduleNextDay() {
        const remaining = this._dayDurationMs - this._elapsed;
        this._timer = this.scene.time.addEvent({
            delay: remaining,
            callback: this._nextDay,
            callbackScope: this,
        });
    }

    _nextDay() {
        this._elapsed = 0;

        // Apply new weather
        const prev = this.weather;
        this.weather = WEATHER_LIST[Math.floor(Math.random() * WEATHER_LIST.length)];

        stateManager.nextDay();
        this.scene.events.emit('day_changed',     stateManager.day);
        this.scene.events.emit('weather_changed',  this.weather);
        this.scene.events.emit('time_progress',    0);

        this._scheduleNextDay();
    }

    skipToNextDay() {
        if (this._timer) this._timer.remove(false);
        this._nextDay();
    }

    isRainy() {
        return this.weather === Weather.RAINY;
    }

    /** Thời tiết hiện tại */
    getWeather() {
        return this.weather;
    }

    destroy() {
        if (this._timer)  this._timer.remove(false);
        if (this._ticker) this._ticker.remove(false);
    }
}
