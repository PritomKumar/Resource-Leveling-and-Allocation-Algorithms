"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Activity {
    constructor(name = "", resource = 0, duration = 0) {
        this.name = "";
        this.description = "";
        this.resource = 0;
        this.duration = 0;
        //Has to solve activity issue
        //prevActivity:Activity = new Activity();
        //nextActivity: Array<Activity> = [];
        this.earlyStart = 0;
        this.earlyFinish = 0;
        this.lateStart = 0;
        this.lateFinish = 0;
        this.totalFloat = 0;
        this.name = name.toLowerCase();
        this.duration = duration;
        this.resource = resource;
    }
}
var a = new Activity("A", 3, 3);
let str = "sd a  dfs sdf ";
try {
    // var data = fs.readFileSync("F:\\IIT 8th Semester\\Software Project Management\\Group Assingments\\Project 1\\src\\input.txt", 'utf8');
    var data = fs_1.default.readFileSync("src\\input.txt", "utf8");
    console.log(data);
}
catch (e) {
    console.log("Error:", e.stack);
}
//# sourceMappingURL=start.js.map