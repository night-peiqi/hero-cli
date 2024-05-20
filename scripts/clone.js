import download from "download-git-repo";
import ora from "ora";
import chalk from "chalk";

/**
 * 克隆模板
 * @param {String} repository 远程仓库地址
 * @param {String} projectName 项目名称
 * @returns
 */
export default (repository, projectName) => {
  const spinner = ora("create project...");
  spinner.start();

  return new Promise((resolve, reject) => {
    download(repository, projectName, { clone: true }, (err) => {
      if (err) {
        spinner.fail(chalk.redBright(err));
        reject(err)
      } else {
        resolve()
      }
    });
  })
}