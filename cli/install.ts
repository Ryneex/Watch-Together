import chalk from "chalk";
import { execSync } from "child_process";
import ora from "ora";

const spinner = ora({
    text: chalk.blueBright("Installing frontend packages..."),
    color: "blue",
});
spinner.start();

try {
    execSync("cd ./frontend && npm i", { stdio: "inherit" });
    spinner.succeed(chalk.greenBright("Both Frontend and Backend packages installed successfully!"));
} catch (error) {
    spinner.fail(chalk.redBright("Failed to install packages."));
    console.error(error);
}
