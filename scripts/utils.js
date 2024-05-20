import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import logSymbols from 'log-symbols'

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

/**
 * 删除文件夹
 * @param {*} dir 
 * @returns 
 */
export const removeDir = async (dir) => {
  try {
    await fs.remove(resolveApp(dir));
    console.log(logSymbols.warning, `Overwritten folder with the same name ${dir}`);
  } catch (err) {
    console.log(err);
    return;
  }
}

/**
 * 修改package.json配置
 * @param {*} name 
 * @param {*} info 
 */
export const changePackageJson = async (name, info) => {
  const pkgPath = resolveApp(`${name}/package.json`);

  try {
    const pkg = await fs.readJson(pkgPath);

    Object.keys(info).forEach((item) => {
      if (info[item] && info[item].trim()) {
        pkg[item] = info[item];
      }
    });
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  } catch (err) {
    console.log(err);
    console.log(logSymbols.warning, chalk.yellow("Updating project information failed, please manually modify package.json"));
  }
}

/**
 * 等待
 * @param {*} ms 
 * @returns 
 */
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));