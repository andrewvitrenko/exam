const MAX_VALUE = 100;
const MIN_VALUE = 0;
const MIN_START_VALUE = 5;
const INTERVAL = 5000;
const INTERVAL_DECREMENT = 3;
const CIRCLE_RADIUS = 30;

let game;

const config = {
  food: {
    name: 'Food',
    id: 'food',
    circleId: 'food-circle',
    controllers: [{
      buttonId: 'feed',
      fieldsToChange: [
        { field: 'food', delta: 30 },
        { field: 'clean', delta: -20 },
      ],
    }, {
      buttonId: 'buy-food',
      fieldsToChange: [
        { field: 'food', delta: 20 },
        { field: 'money', delta: -20 },
      ]
    }]
  },
  clean: {
    name: 'Clean',
    id: 'clean',
    circleId: 'clean-circle',
    controllers: [{
      buttonId: 'wash',
      fieldsToChange: [
        { field: 'clean', delta: 40 },
        { field: 'happiness', delta: -20 },
      ]
    }],
  },
  happiness: {
    name: 'Happiness',
    id: 'happiness',
    circleId: 'happiness-circle',
    controllers: [{
      buttonId: 'play',
      fieldsToChange: [
        { field: 'happiness', delta: 15 },
        { field: 'food', delta: -10 },
      ],
    }],
  },
  health: {
    name: 'Health',
    id: 'health',
    circleId: 'health-circle',
    controllers: [{
      buttonId: 'treat',
      fieldsToChange: [
        { field: 'health', delta: 30 },
        { field: 'money', delta: -20 },
      ]
    }],
  },
  socialization: {
    name: 'Socialization',
    id: 'socialization',
    circleId: 'socialization-circle',
    controllers: [{
      buttonId: 'go-to-bar',
      fieldsToChange: [
        { field: 'socialization', delta: 40 },
        { field: 'food', delta: 10 },
        { field: 'health', delta: -10 },
        { field: 'money', delta: -20 },
      ],
    }],
  },
  money: {
    name: 'Money',
    id: 'money',
    circleId: 'money-circle',
    controllers: [{
      buttonId: 'work',
      fieldsToChange: [
        { field: 'money', delta: 50 },
        { field: 'food', delta: -10 },
        { field: 'health', delta: -10 },
        { field: 'socialization', delta: -20 }
      ]
    }, {
      buttonId: 'start-business',
      fieldsToChange: [
        { field: 'money', delta: 100 },
        { field: 'happiness', delta: 100 },
        { field: 'health', delta: -100 },
        { field: 'socialization', delta: 20 }
      ]
    }],
  },
};

class Game {
  params = {};

  constructor() {
    for (const item in config) {
      this.params[config[item].id] = new Param({...config[item]});
    }
  }

  start() {
    for (const param in this.params) {
      this.params[param].start();
    }
  }

  stop(name) {
    for (const param in this.params) {
      this.params[param].stop();
    }
    alert(`${name} is out. Game over`);
  }

  reset() {
    for (const param in this.params) {
      this.params[param].reset();
    }
  }
}

class Param {
  progressContainer;
  circle;
  interval;
  value;
  name;
  handlers = [];

  constructor({ name, id, circleId, controllers }) {
    this.progressContainer = document.getElementById(id);
    this.name = name;
    this.circle = document.getElementById(circleId);

    for (const controller of controllers) {
      const { buttonId, fieldsToChange } = controller;
      const handleFunction = () => fieldsToChange.map(({ field, delta }) => {
        game.params[field].update(game.params[field].value + delta);
      });
      this.handlers.push({ buttonId, handleFunction });
    }
  }

  start() {
    const startValue = Math.max(Math.round(Math.random() * MAX_VALUE), MIN_START_VALUE);
    this.update(startValue);
    this.interval = setInterval(() => this.update(this.value - INTERVAL_DECREMENT), INTERVAL);
    this.handlers.map(({ buttonId, handleFunction }) => {
      const button = document.getElementById(buttonId);
      button.addEventListener('click', handleFunction);
    });
  }

  update(newValue) {
    if (newValue >= MAX_VALUE) {
      this.value = MAX_VALUE;
    } else if (newValue <= MIN_VALUE) {
      this.value = MIN_VALUE;
      game.stop(this.name);
    } else {
      this.value = newValue;
    }

    const offset = 2 * Math.PI * CIRCLE_RADIUS * (MAX_VALUE - this.value) / MAX_VALUE;
    this.circle.style.strokeDashoffset = `${offset}px`;
    this.progressContainer.innerHTML = this.value;
  }

  reset() {
    clearInterval(this.interval);
    this.value = MIN_VALUE;
    this.progressContainer.innerHTML = this.value;
    this.circle.style.strokeDashoffset = `${MIN_VALUE}`;
  }

  stop() {
    clearInterval(this.interval);
    this.handlers.map(({ buttonId, handleFunction }) => {
      const button = document.getElementById(buttonId);
      button.removeEventListener('click', handleFunction);
    });
  }
}

window.addEventListener('load', () => {
  game = new Game();
  const startButton = document.getElementById('start');
  const resetButton = document.getElementById('reset');

  startButton.addEventListener('click', () => {
    game.start();
  });
  resetButton.addEventListener('click', () => {
    game.reset();
  });
});
