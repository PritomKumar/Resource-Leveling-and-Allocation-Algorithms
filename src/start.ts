export {};
import fs from "fs";
import { isFunctionDeclaration, updateBreak } from "typescript";

const readline = require("readline");
var allActivitys = new Array<Activity>();
var originalAllActivitys = new Array<Activity>();
var allActivitysCopy = new Array<Activity>();
var finalBurgessActivities = new Array<Activity>();
var finalEstimatedActivities = new Array<Activity>();
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
        activityCount = 0;
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

function addRelationToMatrixParameterVersion(copycopy: Activity[]) {
    for (var i: number = 0; i < copycopy.length; i++) {
        var relations = copycopy[i].nextActivity;
        for (var j: number = 0; j < relations.length; j++) {
            for (var k: number = 0; k < copycopy.length; k++) {
                if (copycopy[k].name == copycopy[i].nextActivity[j]) {
                    relationMatrix[i][k] = 1;
                    relationMatrix[k][i] = 2;
                }
            }
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
        // allActivitys[i].totalFloat =
        //     allActivitys[i].lateStart - allActivitys[i].earlyStart;
        allActivitys[i].totalFloat =
            allActivitys[i].lateFinish -
            allActivitys[i].earlyStart -
            allActivitys[i].duration;
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

function calcucateRSquareParameterVersion(
    AllActivitys: Array<Activity>
): number {
    var rSquareTotal: number = 0;
    for (var i: number = 1; i <= totalDays; i++) {
        var rSquare: number = 0;
        var r: number = 0;
        for (var j: number = 0; j < AllActivitys.length ; j++) {
            if (
                AllActivitys[j].currentStart < i &&
                AllActivitys[j].currentFinish >= i
            ) {
                r += AllActivitys[j].resource;
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
    //console.log("All floats ");
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
    var floatSpace: number =
        latestActivity.lateFinish - latestActivity.currentFinish;
    var originalActivityIndex: number = stringToNumberConverter(
        latestActivity.name
    );
    // console.log("calculateFloatSpace   ");
    // console.log(latestActivity);

    for (var i: number = 1; i < activityCount - 1; i++) {
        if (
            relationMatrix[originalActivityIndex][i] == 1
            //&& checkIfActivityIsInFloatActivities(allActivitys[i])
        ) {
            floatSpace = Math.min(
                floatSpace,
                allActivitys[i].currentStart - latestActivity.currentFinish
            );
            if (floatSpace < 0) {
                floatSpace = 0;
            }
            //console.log("lala " + floatSpace);
            // console.log(allActivitys[i]);
        }
    }
    //console.log("final = " + floatSpace);
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
    finalBurgessActivities = { ...allActivitys };
    for (var l: number = 0; l < floatActivitys.length; l++) {
        allActivitysCopy = { ...allActivitys };
        console.log("\n\nTesting number =  " + l + "\n\n");
        for (var k: number = 0; k < floatActivitys.length; k++) {
            // console.log("count = ");
            // console.log(counxtAvailableFloat());
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
            //console.log("originalActivityIndex = " + originalActivityIndex);

            var originalActivity = { ...allActivitys[originalActivityIndex] };
            // console.log("original ");
            // console.log(originalActivity);
            var floatSpace: number = calculateFloatSpace(originalActivity);
            if (floatSpace == 0) continue;

            for (var i: number = 0; i < floatSpace; i++) {
                allActivitys[originalActivityIndex].currentStart =
                    originalActivity.currentStart + i + 1;
                allActivitys[originalActivityIndex].currentFinish =
                    originalActivity.currentFinish + i + 1;
                calculatedRsquare = calcucateRSquare();
                console.log(calculatedRsquare);
                if (calculatedRsquare < initialRsquare) {
                    initialRsquare = calculatedRsquare;
                    position = i + 1;
                }
            }

            allActivitys[originalActivityIndex].currentStart =
                originalActivity.currentStart + position;
            allActivitys[originalActivityIndex].currentFinish =
                originalActivity.currentFinish + position;

            floatActivitys[latestActivityIndex].currentFinish = -1;
            //calculatedRsquare = calcucateRSquare();
            console.log("Rsquare = " + initialRsquare);
            console.log(allActivitys[originalActivityIndex]);
            if (initialRsquare > totalRsquare) {
                allActivitys = allActivitysCopy;
            } else {
                totalRsquare = initialRsquare;
                finalBurgessActivities = { ...allActivitys };
            }
        }
        // if (calcucateRSquare() < totalRsquare) {
        //     totalRsquare = calcucateRSquare();
        // }
        floatActivitys = [];
        await findFloatActivities();
    }
    console.log("totalRsquare = " + totalRsquare);
    console.log(finalBurgessActivities);
}

var initialRsquare: number = Infinity;

async function estimatedResourceLeveling1() {
    var calculatedRsquare: number = 0;
    var position: number = 0;

    var latestActivityIndex: number = findLatestActivity();
    //console.log("latestActivityIndex = " + latestActivityIndex);
    var latestActivity = floatActivitys[latestActivityIndex];
    var originalActivityIndex: number = stringToNumberConverter(
        latestActivity.name
    );
    //console.log("originalActivityIndex = " + originalActivityIndex);

    var originalActivity = { ...allActivitys[originalActivityIndex] };
    // console.log("original ");
    // console.log(originalActivity);
    var floatSpace: number = calculateFloatSpace(originalActivity);
    //if (floatSpace == 0) continue;

    for (var i: number = 0; i <= floatSpace; i++) {
        allActivitys[originalActivityIndex].currentStart =
            originalActivity.currentStart + i;
        allActivitys[originalActivityIndex].currentFinish =
            originalActivity.currentFinish + i;
        floatActivitys[latestActivityIndex].currentFinish = -1000;
        for (var j: number = 0; j <= floatSpace; j++) {
            var latestActivityIndex: number = findLatestActivity();
            //console.log("latestActivityIndex = " + latestActivityIndex);
            var latestActivity = floatActivitys[latestActivityIndex];
            var originalActivityIndex: number = stringToNumberConverter(
                latestActivity.name
            );
            allActivitys[originalActivityIndex].currentStart =
                originalActivity.currentStart + j;
            allActivitys[originalActivityIndex].currentFinish =
                originalActivity.currentFinish + j;
            floatActivitys[latestActivityIndex].currentFinish = -1000;
            for (var k: number = 0; k <= floatSpace; k++) {
                var latestActivityIndex: number = findLatestActivity();
                //console.log("latestActivityIndex = " + latestActivityIndex);
                var latestActivity = floatActivitys[latestActivityIndex];
                var originalActivityIndex: number = stringToNumberConverter(
                    latestActivity.name
                );
                allActivitys[originalActivityIndex].currentStart =
                    originalActivity.currentStart + k;
                allActivitys[originalActivityIndex].currentFinish =
                    originalActivity.currentFinish + k;
                floatActivitys[latestActivityIndex].currentFinish = -1000;
                for (var l: number = 0; l <= floatSpace; l++) {
                    var latestActivityIndex: number = findLatestActivity();
                    //console.log("latestActivityIndex = " + latestActivityIndex);
                    var latestActivity = floatActivitys[latestActivityIndex];
                    var originalActivityIndex: number = stringToNumberConverter(
                        latestActivity.name
                    );
                    allActivitys[originalActivityIndex].currentStart =
                        originalActivity.currentStart + l;
                    allActivitys[originalActivityIndex].currentFinish =
                        originalActivity.currentFinish + l;
                    floatActivitys[latestActivityIndex].currentFinish = -1000;
                    for (var m: number = 0; m <= floatSpace; m++) {
                        var latestActivityIndex: number = findLatestActivity();
                        //console.log("latestActivityIndex = " + latestActivityIndex);
                        var latestActivity =
                            floatActivitys[latestActivityIndex];
                        var originalActivityIndex: number = stringToNumberConverter(
                            latestActivity.name
                        );
                        allActivitys[originalActivityIndex].currentStart =
                            originalActivity.currentStart + m;
                        allActivitys[originalActivityIndex].currentFinish =
                            originalActivity.currentFinish + m;
                        floatActivitys[
                            latestActivityIndex
                        ].currentFinish = -1000;
                        for (var n: number = 0; n <= floatSpace; n++) {
                            var latestActivityIndex: number = findLatestActivity();
                            //console.log("latestActivityIndex = " + latestActivityIndex);
                            var latestActivity =
                                floatActivitys[latestActivityIndex];
                            var originalActivityIndex: number = stringToNumberConverter(
                                latestActivity.name
                            );
                            allActivitys[originalActivityIndex].currentStart =
                                originalActivity.currentStart + n;
                            allActivitys[originalActivityIndex].currentFinish =
                                originalActivity.currentFinish + n;
                            floatActivitys[
                                latestActivityIndex
                            ].currentFinish = -1000;
                            for (var o: number = 0; o <= floatSpace; o++) {
                                var latestActivityIndex: number = findLatestActivity();
                                //console.log("latestActivityIndex = " + latestActivityIndex);
                                var latestActivity =
                                    floatActivitys[latestActivityIndex];
                                var originalActivityIndex: number = stringToNumberConverter(
                                    latestActivity.name
                                );
                                allActivitys[
                                    originalActivityIndex
                                ].currentStart =
                                    originalActivity.currentStart + o;
                                allActivitys[
                                    originalActivityIndex
                                ].currentFinish =
                                    originalActivity.currentFinish + o;
                                calculatedRsquare = calcucateRSquare();
                                floatActivitys[
                                    latestActivityIndex
                                ].currentFinish = -1000;
                                calculatedRsquare = calcucateRSquare();
                                console.log(calculatedRsquare);
                                if (calculatedRsquare < initialRsquare) {
                                    initialRsquare = calculatedRsquare;
                                    console.log(
                                        "Initial Rsquare = " + initialRsquare
                                    );
                                    finalEstimatedActivities = {
                                        ...allActivitys,
                                    };
                                }
                                floatActivitys = [];
                                await findFloatActivities();
                            }
                        }
                    }
                }
            }
        }
    }

    allActivitys[originalActivityIndex].currentStart =
        originalActivity.currentStart + position;
    allActivitys[originalActivityIndex].currentFinish =
        originalActivity.currentFinish + position;

    floatActivitys[latestActivityIndex].currentFinish = -1;
    //calculatedRsquare = calcucateRSquare();
    console.log("Rsquare = " + initialRsquare);
}

async function estimatedResourceLeveling2(
    latestActivity: Activity,
    array: Array<Array<Activity>>,
    floatSpace: number
) {
    for (
        var i: number = 0;
        i <= Math.max(floatSpace, calculateFloatSpace(latestActivity));
        i++
    ) {
        // if (
        //     calculateFloatSpace(latestActivity) == 0 &&
        //     floatSpace != calculateFloatSpace(latestActivity)
        // ) {
        //     continue;
        // }
        // if (latestActivity.currentFinish > latestActivity.lateFinish) {
        //     continue;
        // }

        var originalActivityIndex: number = stringToNumberConverter(
            latestActivity.name
        );
        var originalActivity = { ...allActivitys[originalActivityIndex] };
        allActivitys[originalActivityIndex].currentStart =
            allActivitys[originalActivityIndex].earlyStart + i;
        allActivitys[originalActivityIndex].currentFinish =
            allActivitys[originalActivityIndex].earlyFinish + i;

        // latestActivity.currentStart += 1;
        // latestActivity.currentFinish += 1;

        var newActivityArray = new Array<Array<Activity>>();
        newActivityArray = array;
        newActivityArray.push({ ...allActivitys });
        //newActivityArray.pop();

        // var calculatedRsquare = calcucateRSquare();
        // console.log(latestActivity.name);
        // console.log(
        //     calculatedRsquare + "  = " + i + " Float space = " + floatSpace
        // );
        // if (calculatedRsquare < initialRsquare) {
        //     initialRsquare = calculatedRsquare;
        //     console.log("totalRsquare = " + initialRsquare);
        //     finalEstimatedActivities = { ...allActivitys };
        // }
        for (var j: number = 1; j < activityCount - 1; j++) {
            // for (var j: number = activityCount - 2; j >=1 ; j--) {
            if (relationMatrix[originalActivityIndex][j] == 2) {
                await estimatedResourceLeveling2(
                    allActivitys[j],
                    newActivityArray,
                    calculateFloatSpace(allActivitys[j])
                );
                // allActivitys[originalActivityIndex] = originalActivity;
            }
        }
    }
}

async function estimatedResourceLeveling3(
    latestActivity: Activity,
    array: Array<Activity>,
    floatSpace: number
) {
    for (
        var i: number = latestActivity.currentFinish;
        i <= latestActivity.earlyFinish + latestActivity.totalFloat &&
        (!array.length || i < array[array.length - 1].currentStart);
        i++
    ) {
        // if (
        //     calculateFloatSpace(latestActivity) == 0 &&
        //     floatSpace != calculateFloatSpace(latestActivity)
        // ) {
        //     continue;
        // }
        // if (latestActivity.currentFinish > latestActivity.lateFinish) {
        //     continue;
        // }

        var originalActivityIndex: number = stringToNumberConverter(
            latestActivity.name
        );
        var originalActivity = { ...allActivitys[originalActivityIndex] };
        allActivitys[originalActivityIndex].currentStart =
            allActivitys[originalActivityIndex].earlyStart +
            i -
            latestActivity.currentFinish;
        allActivitys[originalActivityIndex].currentFinish =
            allActivitys[originalActivityIndex].earlyFinish +
            i -
            latestActivity.currentFinish;

        // latestActivity.currentStart += 1;
        // latestActivity.currentFinish += 1;

        //var newActivityArray = new Array<Array<Activity>>();

        var newActivityArray = array.length ? [...array] : Array<Activity>();
        //console.log("Kichu = " + newActivityArray);
        newActivityArray.push(latestActivity);
        //newActivityArray.pop();

        var calculatedRsquare = calcucateRSquare();
        console.log(latestActivity.name);
        console.log(
            calculatedRsquare +
                "  = " +
                (i - latestActivity.earlyFinish) +
                " Float space = " +
                floatSpace
        );
        if (calculatedRsquare < initialRsquare) {
            initialRsquare = calculatedRsquare;
            console.log("totalRsquare = " + initialRsquare);
            finalEstimatedActivities = { ...allActivitys };
        }
        for (var j: number = 1; j < activityCount - 1; j++) {
            // for (var j: number = activityCount - 2; j >=1 ; j--) {
            if (relationMatrix[originalActivityIndex][j] == 2) {
                await estimatedResourceLeveling3(
                    allActivitys[j],
                    newActivityArray,
                    calculateFloatSpace(allActivitys[j])
                );
                // allActivitys[originalActivityIndex] = originalActivity;
            }
        }
    }
}

function checkIfValidActivity(AldlActivitys: Array<Activity>): boolean {
    //addRelationToMatrixParameterVersion(AldlActivitys);
    for (var i: number = 0; i < AldlActivitys.length; i++) {
        var relations = AldlActivitys[i].nextActivity;
        for (var j: number = 0; j < relations.length; j++) {
            for (var k: number = 0; k < AldlActivitys.length; k++) {
                if (AldlActivitys[k].name == AldlActivitys[i].nextActivity[j]) {
                    if (
                        AldlActivitys[i].currentFinish >
                        AldlActivitys[k].currentStart
                    ) {
                        return false;
                    }
                }
            }
        }
        // for (var j: number = 0; j < AldlActivitys.length; j++) {
        //     if (relationMatrix[i][j] == 1) {
        //         if (
        //             AldlActivitys[i].currentFinish >
        //             AldlActivitys[j].currentStart
        //         ) {
        //             return false;
        //         }
        //     }
        // }
    }

    return true;
}
var megaActivies = Array<Array<Activity>>();

async function resultCalculation() {
    // for (var i: number = 0; i < 10; i++) {
    //     console.log(
    //         megaActivies[i].map((a) => `${a.name}_${a.currentStart}`).join("->")
    //     );
    // }
    // console.log("llala");
    // for (
    //     var i: number = megaActivies.length - 10;
    //     i < megaActivies.length;
    //     i++
    // ) {
    //     console.log(
    //         megaActivies[i].map((a) => `${a.name}_${a.currentStart}`).join("->")
    //     );
    // }

    for (var i: number = 0; i < megaActivies.length; i++) {
        if (!checkIfValidActivity(megaActivies[i])) {
            continue;
        }
        var calculatedRsquare = calcucateRSquareParameterVersion(
            megaActivies[i]
        );
        //console.log("calculatedRsquare  " + calculatedRsquare);
        // console.log(
        //     calculatedRsquare + "  = " + i + " Float space = " + floatSpace
        // );
        if (calculatedRsquare < initialRsquare) {
            initialRsquare = calculatedRsquare;
            console.log("totalRsquare = " + initialRsquare);
            finalEstimatedActivities = [...megaActivies[i]];
        }
    }
}

async function estimatedResourceLeveling4() {
    await findFloatActivities();
    //console.log(allActivitys);

    var onnoNam = allActivitys.sort((a, b) => a.lateFinish - b.lateFinish);
    console.log(onnoNam.map((a) => `${a.name}_${a.lateFinish}`).join("->"));
    megaActivies.push([...onnoNam]);
    //console.log(megaActivies);
    //var newOriginalActivities = { ...onnoNam };
    for (var k: number = onnoNam.length - 1; k >= 0; k--) {
        if (onnoNam[k].lateFinish == Infinity) {
            continue;
        }
        var tempArray = [...megaActivies];
        for (var i: number = 0; i < megaActivies.length; i++) {
            //console.log("3rd for ");
            for (var j: number = 0; j <= onnoNam[k].totalFloat; j++) {
                //console.log("4th for ");
                //console.log(tempActivityArray[k].name);
                var tempActivityArray = [...megaActivies[i]];
                tempActivityArray[k].currentStart =
                    tempActivityArray[k].earlyStart + j;
                tempActivityArray[k].currentFinish =
                    tempActivityArray[k].earlyFinish + j;
                console.log(
                    tempActivityArray
                        .map((a) => `${a.name}_${a.lateFinish}`)
                        .join("->")
                );
                if (checkIfValidActivity(tempActivityArray)) {
                    var calculatedRsquare = calcucateRSquareParameterVersion(
                        tempActivityArray
                    );
                    if (calculatedRsquare < initialRsquare) {
                        initialRsquare = calculatedRsquare;
                        console.log("totalRsquare = " + initialRsquare);
                        finalEstimatedActivities = [...megaActivies[i]];
                    }
                    tempArray.push([...tempActivityArray]);
                }
            }
        }
        megaActivies = [...tempArray];
        console.log(megaActivies.length + "  " + onnoNam[k].name);
        // console.log(megaActivies[megaActivies.length-1].map(a=>`${a.name}_${a.currentStart}`).join("->"));
        //console.log(megaActivies);
    }
    //console.log(megaActivies);
}

async function estimatedResourceLeveling6() {
    var onnoNam = allActivitys.sort((a, b) => a.lateFinish - b.lateFinish);
    for (var i: number = 0; i < onnoNam.length; i++) {
        if (onnoNam[i].lateFinish == Infinity) {
            continue;
        }
        var arr = megaActivies.length ? [...megaActivies] : [];
        for (var j = 0; j <= onnoNam[i].totalFloat; j++) {
            var temp = { ...onnoNam[i] };
            temp.currentStart = temp.earlyStart + j;
            temp.currentFinish = temp.earlyFinish + j;

            for (var k = 0; k < megaActivies.length; k++) {
                var copycopy = megaActivies[k].length
                    ? [...megaActivies[k]]
                    : [];
                copycopy.push(temp);
                // if (checkIfValidActivity(copycopy)) {
                //     break;
                // }
                arr.push(copycopy);

                // arr.splice(k); //Vejall

                arr = arr.filter((a) => a !== megaActivies[k]);
            }
            if (!arr.length) {
                arr.push([temp]);
            }
        }
        console.log(megaActivies.length + "  " + onnoNam[i].name);
        megaActivies = arr;
    }
}

async function estimatedResourceLeveling7() {
    var onnoNam = allActivitys.sort((a, b) => a.lateFinish - b.lateFinish);
    for (var i: number = 0; i < onnoNam.length; i++) {
        if (onnoNam[i].lateFinish == Infinity) {
            continue;
        }
        var arr = megaActivies.length ? [...megaActivies] : [];
        for (var j = 0; j <= onnoNam[i].totalFloat; j++) {
            var temp = { ...onnoNam[i] };
            temp.currentStart = temp.earlyStart + j;
            temp.currentFinish = temp.earlyFinish + j;

            for (var k = 0; k < megaActivies.length; k++) {
                var copycopy = megaActivies[k].length
                    ? [...megaActivies[k]]
                    : [];
                copycopy.push(temp);
                // if (checkIfValidActivity(copycopy)) {
                //     break;
                // }
                arr.push(copycopy);

                // arr.splice(k); //Vejall

                arr = arr.filter((a) => a !== megaActivies[k]);
            }
            if (!arr.length) {
                arr.push([temp]);
            }
        }
        console.log(megaActivies.length + "  " + onnoNam[i].name);
        megaActivies = arr;
    }
}

var combinationArray = Array<Array<number>>();

async function estimatedResourceLeveling5() {
    await findFloatActivities();
    megaActivies.push({ ...allActivitys });
    //var newOriginalActivities = { ...allActivitys };
    for (var k: number = 0; k < floatActivitys.length; k++) {
        var latestActivityIndex: number = findLatestActivity();
        var latestActivity = { ...floatActivitys[latestActivityIndex] };
        floatActivitys[latestActivityIndex].currentFinish = -1000;
        var activityArray = Array<Array<Activity>>();
        var originalActivityIndex: number = stringToNumberConverter(
            latestActivity.name
        );

        for (var i: number = 0; i < megaActivies.length; i++) {
            var tempActivityArray = { ...megaActivies[i] };
            for (var j: number = 0; j <= latestActivity.totalFloat; j++) {
                tempActivityArray[originalActivityIndex].currentStart =
                    tempActivityArray[originalActivityIndex].earlyStart + j;
                tempActivityArray[originalActivityIndex].currentFinish =
                    tempActivityArray[originalActivityIndex].earlyFinish + j;
                if (checkIfValidActivity(tempActivityArray)) {
                    megaActivies.push({ ...tempActivityArray });
                }
            }
        }
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
    originalAllActivitys = [...allActivitys];
    //console.log(floatActivitys);
    await burgessResourceLeveling();
    console.log(
        finalBurgessActivities
            .map((a) => `${a.name}_${a.currentStart}_${a.currentFinish}`)
            .join("->")
    );
    console.log("Final Rsquare for burgess = " + totalRsquare);
    allActivitys = [...originalAllActivitys];
    var latestActivityIndex: number = findLatestActivity();

    // await estimatedResourceLeveling2(
    //     allActivitys[activityCount - 2],
    //     megaActivies,
    //     calculateFloatSpace(allActivitys[activityCount - 2])
    // );
    // await resultCalculation();
    //await estimatedResourceLeveling4();
    await estimatedResourceLeveling6();
    await resultCalculation();
    console.log(
        finalEstimatedActivities
            .map((a) => `${a.name}_${a.currentStart}_${a.currentFinish}`)
            .join("->")
    );
    //console.log(finalEstimatedActivities);
    console.log("Final Rsquare for emtimated brute force = " + initialRsquare);
}

main();
