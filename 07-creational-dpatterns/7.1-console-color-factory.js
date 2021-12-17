import chalk from 'chalk';

class ColorConsole {
  log(text) {
    console.log(text);
  };
}


class RedConsole extends ColorConsole {
  log(text) {
      console.log(chalk.red(text));
  }
}

class BlueConsole extends ColorConsole {
  log(text) {
      console.log(chalk.blue(text));
  }
}

class GreenConsole extends ColorConsole {
  log(text) {
      console.log(chalk.green(text));
  }
}

function createColorConsole(color) {
  switch(color) {
    case 'blue':
      return new BlueConsole();
    case 'green':
      return new GreenConsole();
    case 'red':
    default:
      return new RedConsole()          
  }
}

// =========== USAGE ==============

const readConsole = createColorConsole('red');
const greenConsole = createColorConsole('green');
const blueConsole = createColorConsole('blue');

readConsole.log("I'M RED");
greenConsole.log("I'M GREEN");
blueConsole.log("I'M BLUE");