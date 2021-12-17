import chalk from 'chalk';

const decorateConsole = (console) => {
  console.red = msg => console.log(chalk.red(msg));
  console.yellow = msg => console.log(chalk.yellow(msg));
  console.green = msg => console.log(chalk.green(msg));
}

decorateConsole(console);

console.red('I AM RED');
console.green('I AM GREEN');
console.yellow('I AM YELLOW');