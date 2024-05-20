#!/usr/bin/env node
import { Command } from 'commander';
import figlet from "figlet";
import fs from "fs-extra";
import { table } from 'table';
import chalk from "chalk";
import create from '../scripts/create.js'
import { templates } from '../scripts/constants.js'

const pkg = fs.readJsonSync(new URL("../package.json", import.meta.url));
const program = new Command();

/**
 * 定义命令行工具的基本信息
 */
program
  .name("hero-cli")
  .description("A simple CLI for scaffolding projects.")
  .usage("<command> [options]")
  .on("--help", () => {
    console.log("\r\n" + chalk.greenBright.bold(figlet.textSync("hero-cli", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 100,
      whitespaceBreak: true,
    })))
    console.log(`\r\n Run ${chalk.cyanBright(`hero-cli <command> --help`)} for detailed usage of given command.`)
  });

/**
 * 定义命令--查看版本号
 */
program.version(pkg.version, "-v, --version");

/**
 * 定义命令--创建项目
 */
program
  .command('create <project-name>')
  .description('create a new project')
  .option("-t --template [template]", "input template name")
  .option("-f --force", "overwrite target directory if it exists")
  .option("-i --ignore", "ignore the template.json file")
  .action(create)

/**
 * 定义命令--查看模板列表
 */
program
.command("ls")
.description("list all the templates")
.action(() => {
  const data = templates.map(item => [chalk.greenBright(item.name), chalk.white(item.desc)]);
  data.unshift([chalk.white("template name"), chalk.white("template description")]);
  console.log(table(data));
})
  
/**
 * 解析命令行参数
 */
program.parse(process.argv)