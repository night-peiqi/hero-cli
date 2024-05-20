import fs from "fs-extra";
import shell from "shelljs"
import chalk from "chalk";
import logSymbols from 'log-symbols'
import clone from './clone.js'
import { removeDir, changePackageJson, delay } from './utils.js'
import { templates, messages } from './constants.js'
import { inquirerConfirm, inquirerChoose, inquirerInputs } from './interactive.js'

/**
 * 创建项目方法
 * @param {*} projectName 项目名称
 * @param {*} option 配置项
 */
export default async (projectName, option) => {
  if (!shell.which("git")) {
    console.log(logSymbols.error, chalk.redBright("Error：运行脚手架必须先安装git！"));
    shell.exit(1);
  }
  // 验证projectName输入是否符合规范
  if (projectName.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
    console.log(logSymbols.error, chalk.redBright("Error：<app-name>存在非法字符！"));
    return;
  }

  let repository = '';

  // 验证是否使用了--template配置项
  if (option.template) {
    // 从模板列表中找到目标templaet，如果不存在则抛出异常
    const template = templates.find(template => template.name === option.template);
    if (!template) {
      console.log(logSymbols.warning, `不存在模板${chalk.yellowBright(option.template)}`);
      console.log(`\r\n运行 ${chalk.cyanBright("my-cli ls")} 查看所有可用模板\r\n`);
      return;
    }
    repository = template.value;
  } else {
    // 从模板列表中选择
    const answer = await inquirerChoose("请选择项目模板：", templates);
    repository = answer.choose;
  }

  let answers = {};

  // 验证是否使用了--ignore配置项
  if (!option.ignore) {
    // 没有使用则需要输入项目信息
    messages.forEach(msg => {
      if (msg.name === "name") {
        msg.default = projectName;
      }
    });
    answers = await inquirerInputs(messages, projectName);
  }

  // 验证是否存在projectName同名文件夹
  if (fs.existsSync(projectName)) {
    if (option.force) {
      // 存在force配置项，直接覆盖
      await removeDir(projectName);
    } else {
      // 不存在force配置项，询问是否覆盖
      const answer = await inquirerConfirm(`已存在同名文件夹${projectName}, 是否覆盖：`);
      if (answer.confirm) {
        await removeDir(projectName);
      } else {
        console.log(logSymbols.error, chalk.redBright(`Error：项目创建失败！存在同名文件夹${projectName}`));
        return;
      }
    }
  }

  // 拉取模板
  try {
    await clone(repository, projectName);
  } catch (err) {
    console.log(logSymbols.error, chalk.redBright("项目创建失败"));
    console.log(err);
    shell.exit(1);
  }

  // 最后更新package.json
  if (answers.name || answers.description) {
    await changePackageJson(projectName, answers);
  }
  // 项目创建成功
  console.log(logSymbols.success, chalk.greenBright("项目创建成功"));
  // 引导用户打开项目并安装依赖
  console.log(`\r\n${chalk.cyanBright("cd")} ${projectName}`);
  console.log(`${chalk.cyanBright("npm install")} \r\n`);
  // 退出进程
  shell.exit(1);
}
