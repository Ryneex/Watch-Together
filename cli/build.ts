import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs-extra";
import ora from "ora";
const arg = process.argv[2];
const spinner = ora(chalk.greenBright("Building..."));
// Do not build frontend if no args are passed
!arg &&
    execSync("cd ./frontend && npm run build", {
        stdio: "inherit",
    });
!arg && fs.rmSync("./build/dist", { force: true, recursive: true });
!arg && fs.moveSync("./frontend/dist", "./build/dist");
spinner.succeed();
const spinner2 = ora(chalk.greenBright("Compiling TypeScript..."));
execSync("npx tsc && tsc-alias", {
    stdio: "inherit",
});
spinner2.succeed(chalk.greenBright(`Application has been built for production \nuse ${chalk.yellowBright("npm run start")}`));
