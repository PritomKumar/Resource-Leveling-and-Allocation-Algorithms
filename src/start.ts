export {};
import fs from 'fs';

class Activity {
    name: string = "";
    description: string = "";
    resource: number = 0;
    duration: number = 0;
    prevActivity:Activity = new Activity();
    nextActivity:Array<Activity> = [];
    earlyStart: number = 0;
    earlyFinish: number = 0;
    lateStart: number = 0;
    lateFinish: number = 0;
    totalFloat: number = 0;

    constructor(
        name: string = "",
        resource: number = 0,
        duration: number = 0
    ) {
        this.name = name.toLowerCase();
        this.duration = duration;
        this.resource = resource;
    }
}

var a = new Activity("A",3,3);

let str = "sd a  dfs sdf ";

var input = fs.readFileSync('input.txt','utf8');
console.log(str);
