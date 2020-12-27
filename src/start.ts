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

class Activity {
    name: string = "";
    description: string = "";
    resource: number = 0;
    duration: number = 0;
    //Has to solve activity issue
    //prevActivity:Activity = new Activity();
    //nextActivity: Array<Activity> = [];
    prevActivity: string = "start";
    nextActivity: Array<string> = ["end"];
    earlyStart: number = 0;
    earlyFinish: number = 0;
    lateStart: number = 0;
    lateFinish: number = 0;
    totalFloat: number = 0;

    constructor(
        name: string = "",
        resource: number = 0,
        duration: number = 0,
        nextActivity: Array<string> = ["end"]
    ) {
        this.name = name.toUpperCase();
        this.duration = duration;
        this.resource = resource;
        if(nextActivity.length == 1 && nextActivity[0] == ''){
            this.nextActivity = ["end"];
        }
        else{
            this.nextActivity = nextActivity;
        }
        
    }
}

async function processLineByLine() {
    try {
        // var data = fs.readFileSync("F:\\IIT 8th Semester\\Software Project Management\\Group Assingments\\Project 1\\src\\input.txt", 'utf8');
        const fileStream = fs.createReadStream("src\\input.txt", "utf8");
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            // console.log(`Line from file: ${line}`);
            var splitted = line.split(",");
            //console.log(splitted[0]);

            //deskhte hobe
            var newActivity = new Activity(
                splitted[0],
                Number(splitted[1]),
                Number(splitted[2]),
                splitted.slice(3,splitted.length)
            );
            activityCount += 1;
            //console.log(newActivity);
            allActivitys.push(newActivity);
            //console.log(allActivitys);
        }
        //console.log(data);
    } catch (e) {
        console.log("Error:", e.stack);
    }
}

function initializeRelationMatrix() {
    for (var i: number = 0; i < activityCount; i++) {
        relationMatrix[i] = new Array<number>();
        for (var j: number = 0; j < activityCount; j++) {
            var temp: number = 0;
            relationMatrix[i][j] = temp;
        }
    }
}

function stringToNumberConverter(str: string): number {
    var num: number = -1;
    switch (str) {
        case "A":
            num = 0;
            break;
        case "B ":
            num = 1;
            break;
        case "C":
            num = 2;
            break;
        case "D":
            num = 3;
            break;
        case "E":
            num = 4;
            break;
        case "F":
            num = 5;
            break;
        case "G":
            num = 6;
            break;
        case "H":
            num = 7;
            break;
        case "I":
            num = 8;
            break;
        case "J":
            num = 9;
            break;
        case "K":
            num = 10;
            break;
        case "L":
            num = 11;
            break;
        default:
            num = -1;
            break;
    }
    return num;
}

async function main() {
    await processLineByLine();
    console.log(allActivitys);
    initializeRelationMatrix();
    //console.log(relationMatrix);
}

main();
