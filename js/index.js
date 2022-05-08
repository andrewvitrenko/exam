let game;

class Game {
  food;
  clean;
  happiness;
  health;
  socialization;
  money;

  constructor () {
    this.food = new Param('Food', 'food', 'food-circle');
    this.clean = new Param('Clean', 'clean', 'clean-circle');
    this.happiness = new Param('Happiness', 'happiness', 'happiness-circle');
    this.health = new Param('Health', 'health', 'health-circle');
    this.socialization = new Param('Socialization', 'socialization', 'socialization-circle');
    this.money = new Param('Money', 'money', 'money-circle');
  }

  start() {
    this.food.start();
    this.clean.start();
    this.happiness.start();
    this.health.start();
    this.socialization.start();
    this.money.start();
  }

  stop(name) {
    this.food.stop();
    this.clean.stop();
    this.happiness.stop();
    this.health.stop();
    this.socialization.stop();
    this.money.stop();
    alert(`${name} is out. Game over`);
  }

  reset() {
    this.food.reset();
    this.clean.reset();
    this.happiness.reset();
    this.health.reset();
    this.socialization.reset();
    this.money.reset();
  }
}

class Param {
  progressContainer;
  circle;
  interval;
  value;
  name;
  handlers;

  constructor(name, id, circleId, handlers) {
    this.progressContainer = document.getElementById(id);
    this.name = name;
    this.circle = document.getElementById(circleId);
    this.handlers = handlers;
  }

  start() {
    const startValue = Math.max(Math.round(Math.random() * 100), 5);
    this.update(startValue);
    this.interval = setInterval(() => this.update(this.value - 10), 1000);
  }

  update(newValue) {
    if (newValue >= 100) {
      this.value = 100;
    } else if (newValue <= 0) {
      this.value = 0;
      game.stop(this.name);
    } else {
      this.value = newValue;
    }

    const offset = 2 * Math.PI * 30 * (100 - this.value) / 100;
    this.circle.style.strokeDashoffset = `${offset}px`;
    this.progressContainer.innerHTML = this.value;
  }

  reset() {
    clearInterval(this.interval);
    this.update(0);
  }

  stop() {
    clearInterval(this.interval);
  }
}
