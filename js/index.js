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
  handlers = [];

  constructor({ name, id, circleId, controllers }) {
    this.progressContainer = document.getElementById(id);
    this.name = name;
    this.circle = document.getElementById(circleId);

    for (const controller of controllers) {
      const { buttonId, fieldsToChange } = controller;
      const handleFunction = () => fieldsToChange.map(({ field, delta }) => {
        game[field].update(game[field].value + delta);
      });
      this.handlers.push({ buttonId, handleFunction });
    }
  }

  start() {
    const startValue = Math.max(Math.round(Math.random() * 100), 5);
    this.update(startValue);
    this.interval = setInterval(() => this.update(this.value - 3), 5000);
    this.handlers.map(({ buttonId, handleFunction }) => {
      const button = document.getElementById(buttonId);
      button.addEventListener('click', handleFunction);
    });
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
    this.value = 0;
    this.progressContainer.innerHTML = this.value;
    this.circle.style.strokeDashoffset = '0';
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
