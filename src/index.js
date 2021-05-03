#!/usr/bin/env node

const inquirer = require('inquirer');
const process = require('process');
const {renderFiles} = require('./lib/renderer');
const {makeFieldQuestions, makeTemplateQuestion} = require('./lib/questions');
const {getConfig, getTemplateConfig} = require('./lib/config');
const log = require('./lib/logging');
const yargs = require('yargs/yargs');

const {argv} = yargs(process.argv.slice(2))
    .usage('Usage: $0 [options]')
    .option('t', {
        alias: 'template',
        describe: 'Specify the template to build',
        type: 'string',
    })
    .option('c', {
        alias: 'config',
        description: 'Specify a custom template file',
        default: 'cookiecutter.config.js',
        type: 'string'
    })
    .alias('v', 'version')
    .alias('h', 'help')
    .help('help');

// legacy config file location override
if (typeof argv.config === 'undefined') {
    const configOption = process.argv.find(piece => piece.slice(0, 3) === '-c=');
    argv.config = configOption ? configOption.slice(3) : 'cookiecutter.config.js';
}

Promise.resolve()
    .then(() => {
        const config = getConfig(argv.config);
        const cliTemplate = (typeof argv !== 'undefined') ? argv.template : false;

        // interpret cli argument --template
        if (!!cliTemplate) {
            return {templateName: cliTemplate};
        }

        // If there is only one template don't ask which template to use.
        if (config.length === 1) {
            return {templateName: config[0].name};
        }

        // ask the user
        return inquirer.prompt(makeTemplateQuestion(argv.config));
    })
    .then(({templateName}) => {
        const templateConfig = getTemplateConfig(templateName, argv.config);
        const allQuestions = makeFieldQuestions(templateConfig);
        const questions = [];
        const cliAnswers = {};

        // check for cli entered answers
        allQuestions.forEach(question => {
            if (!!question.answer) {
                // answer has been defined on the cli
                cliAnswers[question.name] = question.answer;
            } else {
                // add this to the list to prompt the user with
                questions.push(question);
            }
        });

        return inquirer.prompt(questions).then(answers => {
            return {
                templateName,
                fields: Object.assign({}, answers, cliAnswers),
            };
        });
    })
    .then(config => {
        return renderFiles(config, argv.config);
    })
    .catch(e => {
        log.error(e);
        process.exit(1);
    });
