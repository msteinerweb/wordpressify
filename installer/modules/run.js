/**
 * Installation
 */

const fs = require('fs-extra');
const theCWD = process.cwd();
const theCWDArray = theCWD.split('/');
const theDir = theCWDArray[theCWDArray.length - 1];
const ora = require('ora');
const execa = require('execa');
const chalk = require('chalk');
const download = require('download');
const handleError = require('./handleError.js');
const clearConsole = require('./clearConsole.js');
const printNextSteps = require('./printNextSteps.js');


const user = 'msteinerweb';
const repo = 'wordpressify-theme';
const branch = 'master';



module.exports = () => {
	// Init.
	clearConsole();


	// Start.
	console.log('\n');
	console.log(
		'📦 ',
		chalk.black.bgYellow(` Downloading 🎈 WordPressify files in: → ${chalk.bgGreen(` ${theDir} `)}\n`),
		chalk.dim(`\n In the directory: ${theCWD}\n`),
		chalk.dim('This might take a couple of minutes.\n'),
	);

	const spinner = ora({ text: '' });

	// get theme files
	spinner.start(`1. Creating 🎈 WordPressify files inside → ${chalk.black.bgWhite(` ${theDir} `)}`);
	download(`https://github.com/${user}/${repo}/archive/${branch}.zip`, theCWD, {extract: true})

	// .then(() => extract(`${repo}-${branch}.zip`, { dir: theCWD, }))
		.then(() => {
			if(process.platform === 'win32') return execa('xcopy', [`${theCWD}\\${repo}-${branch}\\*.*`, theCWD, '/E/H']);
			return execa('find', [`${theCWD}/${repo}-${branch}`, '-exec', 'mv', '{}', theCWD, '\;']);
		})
		.then(() => fs.remove(`${repo}-${branch}`))


		// download wordpress
		.then(() => {
			spinner.succeed();
			spinner.start(`2. Installing WordPress files from ${chalk.green('https://wordpress.org/')} ...`);
			return fs.mkdir(`${theCWD}/build`)
		})
		.then(() => download('https://www.wordpress.org/latest.zip', `${theCWD}/build`, {extract: true}))


		// install npm
		.then(() => {
			spinner.succeed();
			spinner.start('3. Installing npm packages...');
			return execa('npm', ['install'])
		})

		.then(() => {
			spinner.succeed();
			printNextSteps();
		})

};
