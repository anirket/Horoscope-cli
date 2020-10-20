#!/usr/bin/env node
const horoscopeapi = `http://horoscope-api.herokuapp.com/horoscope`;
const program = require("commander");
const inquirer = require("inquirer");
const fetch = require('node-fetch');
const colors = require('colors');
let finalanswers = [];
let selectedmonth, selectedyear;
let zodiacsign;
let get_request;
let zodiacreading;
let split = [];




program
    .version('1.0.0')
    .description('Shows the Horoscope of the day/week/year baes upon yor birthdate')


program.parse(process.argv);

inquirer
    .prompt([

        {
            type: 'input',
            name: 'birthyear',
            message: 'Enter your birth year...',
            default: '2000',
            validate: birthyearvalidation
        },
        {
            type: 'list',
            name: 'birthmonth',
            message: 'Select Your birthmonth...',
            choices: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            default: '2000',
        },
        {
            type: 'input',
            name: 'birthdate',
            message: 'Enter your birth date...',
            default: '1',
            when: function (answers) {
                selectedmonth = answers.birthmonth
                selectedyear = answers.birthyear
                return true;
            },
            validate: birthdatevalidation
        },
        {
            type: 'list',
            name: 'typeofduration',
            message: 'Which type of Horoscope would you like to know?',
            choices: ['today', 'week', 'month', 'year'],
        }
    ])
    .then(answers => {
        finalanswers = answers;
        zodiacsigndeterminer();       
        getfuturedetails();

    });

function birthdatevalidation(input) {

    if (isNaN(input)) {
        return 'Please Enter a number';
    }
    if (input > 31 || input < 0) {
        return 'Please enter valid birthdate (between 1 and 31)'
    }
    if (selectedmonth == 'Apr' || selectedmonth == 'June' || selectedmonth == 'Sep' || selectedmonth == 'Nov') {
        if (input >= 30) {
            return 'Please enter valid birthdate (month you have choosen has dates between 1 and 30 only)'
        }
    }
    if (selectedmonth == 'Feb') {
        if (selectedyear % 4 === 0) {
            if (input > 29) {
                return 'Please enter valid birthdate (month you have choosen has dates between 1 and 29 only)'
            }
            else {
                return true;
            }
        }
        else {
            if (input > 28) {
                return 'Please enter valid birthdate (month you have choosen has dates between 1 and 28 only)'
            }
            else {
                return true;
            }
        }
    }
    return true;
}


function birthyearvalidation(input) {
    if (isNaN(input)) {
        return 'Please Enter a number';
    }
    if (input.length != 4) {
        return 'Please enter valid birthyear (eg: 2005)'
    }
    return true;
}


function zodiacsigndeterminer() {
    const { birthmonth, birthdate } = finalanswers;
    switch (birthmonth) {
        case 'Jan':
            if (birthdate >= 20) {
                zodiacsign = 'aquarius';
            }
            else {
                zodiacsign = 'capricorn';
            }
            break;
        case 'Feb':
            if (birthdate >= 19) {
                zodiacsign = 'pisces';
            }
            else {
                zodiacsign = 'aquarius';
            }
            break;
        case 'Mar':
            if (birthdate >= 21) {
                zodiacsign = 'aries';
            }
            else {
                zodiacsign = 'pisces';
            }
            break;
        case 'Apr':
            if (birthdate >= 20) {
                zodiacsign = 'taurus';
            }
            else {
                zodiacsign = 'aries';
            }
            break;
        case 'May':
            if (birthdate >= 21) {
                zodiacsign = 'gemini';
            }
            else {
                zodiacsign = 'taurus';
            }
            break;
        case 'June':
            if (birthdate >= 21) {
                zodiacsign = 'cancer';
            }
            else {
                zodiacsign = 'gemini';
            }
            break;
        case 'July':
            if (birthdate >= 23) {
                zodiacsign = 'leo';
            }
            else {
                zodiacsign = 'cancer';
            }
            break;
        case 'Aug':
            if (birthdate >= 23) {
                zodiacsign = 'virgo';
            }
            else {
                zodiacsign = 'leo';
            }
            break;
        case 'Sep':
            if (birthdate >= 23) {
                zodiacsign = 'libra';
            }
            else {
                zodiacsign = 'virgo';
            }
            break;
        case 'Oct':
            if (birthdate >= 23) {
                zodiacsign = 'scorpio';
            }
            else {
                zodiacsign = 'libra';
            }
            break;
        case 'Nov':
            if (birthdate >= 22) {
                zodiacsign = 'sagittarius';
            }
            else {
                zodiacsign = 'scorpio';
            }
            break;
        case 'Dec':
            if (birthdate >= 22) {
                zodiacsign = 'capricorn';
            }
            else {
                zodiacsign = 'sagittarius';
            }
            break;
        default:
            console.log("No suitable match found");
    }
}

function getfuturedetails() {
    console.log("Loading Horoscope Readings for you...(May take a few seconds...)\n");
    const { typeofduration } = finalanswers;
    get_request = `${horoscopeapi}/${typeofduration}/${zodiacsign}`;
    fetch(get_request)
        .then(res => res.json())
        .then(res => {

            zodiacreading = res.horoscope;
            split = zodiacreading.split('.');
            console.log(`Sunsign : ${res.sunsign}`.cyan.italic);
            let lengthofreadings = split.length > 5 ? 5 : split.length;
            for (let i = 0; i < lengthofreadings; i++) {
                if(split[i].length != 0){
                    console.log(`[${i + 1}].\t${split[i]}`.bgBlack.green);
                }
                
            }
            let choosenduration = finalanswers.typeofduration;
            
            if(choosenduration == 'today'){
                console.log(`Date: ${res.date}`.magenta);
            }
            else if(choosenduration == 'week'.magenta)
            {
                console.log(`Week: ${res.week}`.magenta);
            }
            else if(choosenduration == 'month'){
                console.log(`Month: ${res.month}`.magenta);
            }
            else{
                console.log(`Year: ${res.year}`.magenta);
            }

        });


}


