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
    earlyStart: number = 0;
    earlyFinish: number = 0;
    lateStart: number = 0;
    lateFinish: number = 0;
    totalFloat: number = 0;

    constructor(name: string = "", resource: number = 0, duration: number = 0) {
        this.name = name.toLowerCase();
        this.duration = duration;
        this.resource = resource;
    }
}

var a = new Activity("A", 3, 3);

let str = "sd a  dfs sdf ";

try {
    // var data = fs.readFileSync("F:\\IIT 8th Semester\\Software Project Management\\Group Assingments\\Project 1\\src\\input.txt", 'utf8');
    var data = fs.readFileSync("src\\input.txt", "utf8");
    console.log(data);
} catch (e) {
    console.log("Error:", e.stack);
}
