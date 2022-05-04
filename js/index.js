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
      this.stop();
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
