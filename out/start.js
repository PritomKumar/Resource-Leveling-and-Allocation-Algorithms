"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const readline = require("readline");
var allActivitys = new Array();
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
var relationMatrix = [[]];
var activityCount = 0;
class Activity {
    constructor(name = "", resource = 0, duration = 0, nextActivity = ["end"]) {
        this.name = "";
        this.description = "";
        this.resource = 0;
        this.duration = 0;
        //Has to solve activity issue
        //prevActivity:Activity = new Activity();
        //nextActivity: Array<Activity> = [];
        this.prevActivity = "start";
        this.nextActivity = ["end"];
        this.earlyStart = 0;
        this.earlyFinish = 0;
        this.lateStart = 0;
        this.lateFinish = 0;
        this.totalFloat = 0;
        this.name = name.toUpperCase();
        this.duration = duration;
        this.resource = resource;
        if (nextActivity.length == 1 && nextActivity[0] == '') {
            this.nextActivity = ["end"];
        }
        else {
            this.nextActivity = nextActivity;
        }
    }
}
function processLineByLine() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // var data = fs.readFileSync("F:\\IIT 8th Semester\\Software Project Management\\Group Assingments\\Project 1\\src\\input.txt", 'utf8');
            const fileStream = fs_1.default.createReadStream("src\\input.txt", "utf8");
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity,
            });
            try {
                for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                    const line = rl_1_1.value;
                    // console.log(`Line from file: ${line}`);
                    var splitted = line.split(",");
                    //console.log(splitted[0]);
                    //deskhte hobe
                    var newActivity = new Activity(splitted[0], Number(splitted[1]), Number(splitted[2]), splitted.slice(3, splitted.length));
                    activityCount += 1;
                    //console.log(newActivity);
                    allActivitys.push(newActivity);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) yield _a.call(rl_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            //console.log(data);
        }
        catch (e) {
            console.log("Error:", e.stack);
        }
    });
}
function initializeRelationMatrix() {
    for (var i = 0; i < activityCount; i++) {
        relationMatrix[i] = new Array();
        for (var j = 0; j < activityCount; j++) {
            var temp = 0;
            relationMatrix[i][j] = temp;
        }
    }
}
function stringToNumberConverter(str) {
    var num = -1;
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield processLineByLine();
        console.log(allActivitys);
        initializeRelationMatrix();
        //console.log(relationMatrix);
    });
}
main();
//# sourceMappingURL=start.js.map