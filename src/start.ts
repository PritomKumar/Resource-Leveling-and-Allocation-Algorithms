export {};
import fs from "fs";
import { updateBreak } from "typescript";

const readline = require("readline");
var allActivitys = new Array<Activity>();
var floatActivitys = new Array<Activity>();
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
var totalRsquare: number = 0;

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
        case "B":
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

async function calculateESAndEF() {
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

async function calculateLSAndLF() {
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

async function calculateFloat() {
    for (var i: number = 0; i < activityCount - 1; i++) {
        allActivitys[i].totalFloat =
            allActivitys[i].lateStart - allActivitys[i].earlyStart;
    }
}

async function initializeCurrentStartAndFinish() {
    for (var i: number = 0; i < activityCount - 1; i++) {
        allActivitys[i].currentStart = allActivitys[i].earlyStart;
        allActivitys[i].currentFinish = allActivitys[i].earlyFinish;
    }
}

function calcucateRSquare(): number {
    var rSquareTotal: number = 0;
    for (var i: number = 1; i <= totalDays; i++) {
        var rSquare: number = 0;
        var r: number = 0;
        for (var j: number = 1; j < activityCount - 1; j++) {
            if (
                allActivitys[j].currentStart < i &&
                allActivitys[j].currentFinish >= i
            ) {
                r += allActivitys[j].resource;
                //console.log( r + " +  ");
            }
        }
        //console.log(i + "   " + r);
        rSquare = r * r;
        rSquareTotal += rSquare;
    }
    return rSquareTotal;
}

async function findFloatActivities() {
    for (var i: number = 1; i < activityCount - 1; i++) {
        if (allActivitys[i].totalFloat > 0) {
            floatActivitys.push({ ...allActivitys[i] });
        }
    }
}

function findLatestActivity(): number {
    var largestEarlyFinish: number = -10;
    var largestEarlyFinisherActivity: Activity;
    var index: number = -1;
    console.log("All floats ");
    // console.log(floatActivitys);
    // for (var i: number = 0; i < floatActivitys.length; i++) {
    //     if (
    //         floatActivitys[i].currentFinish != -1 &&
    //         floatActivitys[i].currentFinish > largestEarlyFinish
    //     ) {
    //     }
    // }
    for (var i: number = 0; i < floatActivitys.length; i++) {
        if (
            floatActivitys[i].currentFinish != -1 &&
            floatActivitys[i].currentFinish > largestEarlyFinish
        ) {
            largestEarlyFinish = floatActivitys[i].currentFinish;
            index = i;
            largestEarlyFinisherActivity = floatActivitys[i];
        } else if (floatActivitys[i].currentFinish == largestEarlyFinish) {
            largestEarlyFinisherActivity = floatActivitys[i];
            if (
                largestEarlyFinisherActivity.resource <
                floatActivitys[i].resource
            ) {
                largestEarlyFinisherActivity = floatActivitys[i];
                largestEarlyFinish = floatActivitys[i].currentFinish;
                index = i;
            } else {
                largestEarlyFinish = largestEarlyFinisherActivity.currentFinish;
                index = i;
            }
        } else {
            //largestEarlyFinish = largestEarlyFinish;
            //index = i;
        }
    }
    return index;
}

function checkIfActivityIsInFloatActivities(
    relatedActivity: Activity
): boolean {
    for (var i: number = 0; i < floatActivitys.length; i++) {
        if (relatedActivity.name == floatActivitys[i].name) {
            return true;
        }
    }

    return false;
}

function calculateFloatSpace(latestActivity: Activity): number {
    var floatSpace: number = latestActivity.totalFloat;
    var originalActivityIndex: number = stringToNumberConverter(
        latestActivity.name
    );
    // console.log("calculateFloatSpace   ");
    // console.log(latestActivity);

    for (var i: number = 1; i < activityCount - 1; i++) {
        if (
            relationMatrix[originalActivityIndex][i] == 1 &&
            checkIfActivityIsInFloatActivities(allActivitys[i])
        ) {
            floatSpace = Math.min(
                floatSpace,
                allActivitys[i].currentStart - latestActivity.currentFinish
            );
            console.log("lala   " + floatSpace);
            // console.log(allActivitys[i]);
        }
    }
    console.log("final = " + floatSpace);
    return floatSpace;
}

function countAvailableFloat(): number {
    var count: number = 0;
    for (var i: number = 0; i < floatActivitys.length; i++) {
        if (floatActivitys[i].currentFinish != -1) {
            count += 1;
        }
    }

    return count;
}
async function burgessResourceLeveling() {
    for (var k: number = 0; k < floatActivitys.length; k++) {
        console.log("count = ");
        console.log(countAvailableFloat());
        if (countAvailableFloat() == 0) {
            break;
        }
        var initialRsquare: number = Infinity;
        var calculatedRsquare: number = 0;
        var position: number = 0;

        var latestActivityIndex: number = findLatestActivity();
        //console.log("latestActivityIndex = " + latestActivityIndex);
        var latestActivity = floatActivitys[latestActivityIndex];
        var originalActivityIndex: number = stringToNumberConverter(
            latestActivity.name
        );
        console.log("originalActivityIndex = " + originalActivityIndex);

        var originalActivity = { ...allActivitys[originalActivityIndex] };
        console.log("original ");
        console.log(originalActivity);
        var floatSpace: number = calculateFloatSpace(originalActivity);
        for (var i: number = 1; i <= floatSpace; i++) {
            allActivitys[originalActivityIndex].currentStart =
                originalActivity.currentStart + i;
            allActivitys[originalActivityIndex].currentFinish =
                originalActivity.currentFinish + i;
            calculatedRsquare = calcucateRSquare();
            console.log(calculatedRsquare);
            if (calculatedRsquare < initialRsquare) {
                initialRsquare = calculatedRsquare;
                position = i;
            }
        }

        allActivitys[originalActivityIndex].currentStart =
            originalActivity.currentStart + position;
        allActivitys[originalActivityIndex].currentFinish =
            originalActivity.currentFinish + position;

        floatActivitys[latestActivityIndex].currentFinish = -1;
        calculatedRsquare = calcucateRSquare();
        console.log("Final Rsquare = " + calculatedRsquare);
        console.log(allActivitys[originalActivityIndex]);
    }
}

async function main() {
    await processInputLineByLine();
    initializeRelationMatrix();
    addRelationToMatrix();
    //console.log(relationMatrix);
    await calculateESAndEF();
    await calculateLSAndLF();
    await calculateFloat();
    // console.log(allActivitys);
    await initializeCurrentStartAndFinish();
    totalRsquare = calcucateRSquare();
    //console.log(totalRsquare);
    await findFloatActivities();
    //console.log(floatActivitys);
    await burgessResourceLeveling();
}

main();
