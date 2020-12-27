export {};
import fs from "fs";

const readline = require("readline");
var allActivitys = new Array<Activity>();
// var relationMatrix: Array<Array<number>>  = [
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0],
// ];

var relationMatrix: Array<Array<number>> = [[]];
var activityCount: number = 0;
var totalDays: number = 0;

class Activity {
    name: string = "";
    description: string = "";
    resource: number = 0;
    duration: number = 0;
    //Has to solve activity issue
    //prevActivity:Activity = new Activity();
    //nextActivity: Array<Activity> = [];
    prevActivity: string = "START";
    nextActivity: Array<string> = ["END"];
    currentStart: number = 0;
    currentFinish: number = 0;
    earlyStart: number = 0;
    earlyFinish: number = 0;
    lateStart: number = Infinity;
    lateFinish: number = Infinity;
    totalFloat: number = 0;

    constructor(
        name: string = "",
        duration: number = 0,
        resource: number = 0,
        nextActivity: Array<string> = ["END"]
    ) {
        this.name = name.toUpperCase();
        this.duration = duration;
        this.resource = resource;
        if (nextActivity.length == 1 && nextActivity[0] == "") {
            this.nextActivity = ["END"];
        } else {
            this.nextActivity = nextActivity;
        }
    }
}

async function processInputLineByLine() {
    try {
        // var data = fs.readFileSync("F:\\IIT 8th Semester\\Software Project Management\\Group Assingments\\Project 1\\src\\input.txt", 'utf8');
        const fileStream = fs.createReadStream("src\\input.txt", "utf8");
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        var startActivity = new Activity("START", 0, 0, ["NULL"]);
        allActivitys.push(startActivity);

        for await (const line of rl) {
            // console.log(`Line from file: ${line}`);
            var splitted = line.split(",");
            //console.log(splitted[0]);

            //deskhte hobe
            var newActivity = new Activity(
                splitted[0],
                Number(splitted[1]),
                Number(splitted[2]),
                splitted.slice(3, splitted.length)
            );
            activityCount += 1;
            //console.log(newActivity);
            allActivitys.push(newActivity);
            //console.log(allActivitys);
        }
        var endActivity = new Activity("END", 0, 0, ["NULL"]);
        allActivitys.push(endActivity);
        var nullActivity = new Activity("NULL", 0, 0, ["NULL"]);
        allActivitys.push(nullActivity);

        activityCount += 3;

        //console.log(data);
    } catch (e) {
        console.log("Error:", e.stack);
    }
}

function initializeRelationMatrix() {
    for (var i: number = 0; i < activityCount; i++) {
        relationMatrix[i] = new Array<number>();
        for (var j: number = 0; j < activityCount; j++) {
            relationMatrix[i][j] = 0;
        }
    }
}

function stringToNumberConverter(str: string): number {
    var num: number = -1;
    var start: number = 0;
    switch (str) {
        case "START":
            num = start;
            break;
        case "A":
            num = start + 1;
            break;
        case "B ":
            num = start + 2;
            break;
        case "C":
            num = start + 3;
            break;
        case "D":
            num = start + 4;
            break;
        case "E":
            num = start + 5;
            break;
        case "F":
            num = start + 6;
            break;
        case "G":
            num = start + 7;
            break;
        case "H":
            num = start + 8;
            break;
        case "I":
            num = start + 9;
            break;
        case "J":
            num = start + 10;
            break;
        case "K":
            num = start + 11;
            break;
        case "END":
            num = start + 12;
            break;
        case "NULL":
            num = start + 13;
            break;
        default:
            num = -1;
            break;
    }
    return num;
}

function addRelationToMatrix() {
    for (var i: number = 0; i < activityCount; i++) {
        var relations = allActivitys[i].nextActivity;
        for (var j: number = 0; j < relations.length; j++) {
            relationMatrix[i][stringToNumberConverter(relations[j])] = 1;
            relationMatrix[stringToNumberConverter(relations[j])][i] = 2;
        }
    }
}

function calculateESAndEF() {
    var earlyStart: number = 0;
    var earlyFinish: number = 0;
    for (var i: number = 0; i < activityCount - 1; i++) {
        earlyStart = allActivitys[i].earlyStart;
        earlyFinish = allActivitys[i].earlyStart + allActivitys[i].duration;
        for (var j: number = 0; j < activityCount - 1; j++) {
            if (relationMatrix[i][j] == 1) {
                allActivitys[j].earlyStart = Math.max(
                    earlyFinish,
                    allActivitys[j].earlyStart
                );
                allActivitys[j].earlyFinish =
                    allActivitys[j].earlyStart + allActivitys[j].duration;
            }
        }
        allActivitys[i].earlyStart = earlyStart;
        allActivitys[i].earlyFinish = earlyFinish;
    }
}

function calculateLSAndLF() {
    var lastActivity: number = activityCount - 2;
    allActivitys[lastActivity].lateFinish =
        allActivitys[lastActivity].earlyFinish;
    var lateStart: number = 0;
    var lateFinish: number = 0;
    for (var i: number = activityCount - 2; i >= 0; i--) {
        lateFinish = allActivitys[i].lateFinish;
        lateStart = allActivitys[i].lateFinish - allActivitys[i].duration;
        for (var j: number = activityCount - 2; j >= 0; j--) {
            if (relationMatrix[i][j] == 2) {
                allActivitys[j].lateFinish = Math.min(
                    lateFinish,
                    allActivitys[i].lateStart
                );
                allActivitys[j].lateStart =
                    allActivitys[j].lateFinish - allActivitys[j].duration;
            }
        }
        allActivitys[i].lateStart = lateStart;
        allActivitys[i].lateFinish = lateFinish;
    }
    totalDays = allActivitys[lastActivity].earlyFinish;
}

function calculateFloat() {
    for (var i: number = 0; i < activityCount - 1; i++) {
        allActivitys[i].totalFloat =
            allActivitys[i].lateStart - allActivitys[i].earlyStart;
    }
}

function initializeCurrentStartAndFinish() {
    for (var i: number = 0; i < activityCount - 1; i++) {
        allActivitys[i].currentStart = allActivitys[i].earlyStart;
        allActivitys[i].currentFinish = allActivitys[i].earlyFinish;
    }
}

async function main() {
    await processInputLineByLine();
    initializeRelationMatrix();
    addRelationToMatrix();
    //console.log(relationMatrix);
    calculateESAndEF();
    calculateLSAndLF();
    calculateFloat();
    initializeCurrentStartAndFinish();
    console.log(allActivitys);
}

main();
