export {};
import fs from "fs";

class Activity {
    name: string = "";
    description: string = "";
    resource: number = 0;
    duration: number = 0;

    //Has to solve activity issue
    //prevActivity:Activity = new Activity();
    //nextActivity: Array<Activity> = [];
    prevActivity: string = "";
    nextActivity: string = "";
    earlyStart: number = 0;
    earlyFinish: number = 0;
    lateStart: number = 0;
    lateFinish: number = 0;
    totalFloat: number = 0;

    constructor(
        name: string = "",
        resource: number = 0,
        duration: number = 0,
        nextActivity: string = ""
    ) {
        this.name = name.toUpperCase();
        this.duration = duration;
        this.resource = resource;
        this.nextActivity = nextActivity.toUpperCase();
    }
}

const readline = require("readline");

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
        }
        //console.log(data);
    } catch (e) {
        console.log("Error:", e.stack);
    }
}

processLineByLine();
