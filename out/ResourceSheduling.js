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
var megaActivies = Array();
var allActivitys = new Array();
var originalAllActivitys = new Array();
var allActivitysCopy = new Array();
var finalBurgessActivities = new Array();
var finalEstimatedActivities = new Array();
var floatActivitys = new Array();
var relationMatrix = [[]];
var activityCount = 0;
var totalDays = 0;
var totalRsquare = 0;
var initialRsquare = Infinity;
class Activity {
    constructor(name = "", duration = 0, resource = 0, nextActivity = ["END"]) {
        this.name = "";
        this.description = "";
        this.resource = 0;
        this.duration = 0;
        this.prevActivity = "START";
        this.nextActivity = ["END"];
        this.currentStart = 0;
        this.currentFinish = 0;
        this.earlyStart = 0;
        this.earlyFinish = 0;
        this.lateStart = Infinity;
        this.lateFinish = Infinity;
        this.totalFloat = 0;
        this.name = name.toUpperCase();
        this.duration = duration;
        this.resource = resource;
        if (nextActivity.length == 1 && nextActivity[0] == "") {
            this.nextActivity = ["END"];
        }
        else {
            this.nextActivity = nextActivity;
        }
    }
}
function processInputLineByLine() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            activityCount = 0;
            const fileStream = fs_1.default.createReadStream("src\\input.txt", "utf8");
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity,
            });
            var startActivity = new Activity("START", 0, 0, ["NULL"]);
            allActivitys.push(startActivity);
            try {
                for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                    const line = rl_1_1.value;
                    var splitted = line.split(",");
                    var newActivity = new Activity(splitted[0], Number(splitted[1]), Number(splitted[2]), splitted.slice(3, splitted.length));
                    activityCount += 1;
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
            var endActivity = new Activity("END", 0, 0, ["NULL"]);
            allActivitys.push(endActivity);
            var nullActivity = new Activity("NULL", 0, 0, ["NULL"]);
            allActivitys.push(nullActivity);
            activityCount += 3;
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
            relationMatrix[i][j] = 0;
        }
    }
}
function stringToNumberConverter(str) {
    var num = -1;
    var start = 0;
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
    for (var i = 0; i < activityCount; i++) {
        var relations = allActivitys[i].nextActivity;
        for (var j = 0; j < relations.length; j++) {
            relationMatrix[i][stringToNumberConverter(relations[j])] = 1;
            relationMatrix[stringToNumberConverter(relations[j])][i] = 2;
        }
    }
}
function calculateESAndEF() {
    return __awaiter(this, void 0, void 0, function* () {
        var earlyStart = 0;
        var earlyFinish = 0;
        for (var i = 0; i < activityCount - 1; i++) {
            earlyStart = allActivitys[i].earlyStart;
            earlyFinish = allActivitys[i].earlyStart + allActivitys[i].duration;
            for (var j = 0; j < activityCount - 1; j++) {
                if (relationMatrix[i][j] == 1) {
                    allActivitys[j].earlyStart = Math.max(earlyFinish, allActivitys[j].earlyStart);
                    allActivitys[j].earlyFinish =
                        allActivitys[j].earlyStart + allActivitys[j].duration;
                }
            }
            allActivitys[i].earlyStart = earlyStart;
            allActivitys[i].earlyFinish = earlyFinish;
        }
    });
}
function calculateLSAndLF() {
    return __awaiter(this, void 0, void 0, function* () {
        var lastActivity = activityCount - 2;
        allActivitys[lastActivity].lateFinish =
            allActivitys[lastActivity].earlyFinish;
        var lateStart = 0;
        var lateFinish = 0;
        for (var i = activityCount - 2; i >= 0; i--) {
            lateFinish = allActivitys[i].lateFinish;
            lateStart = allActivitys[i].lateFinish - allActivitys[i].duration;
            for (var j = activityCount - 2; j >= 0; j--) {
                if (relationMatrix[i][j] == 2) {
                    allActivitys[j].lateFinish = Math.min(lateFinish, allActivitys[i].lateStart);
                    allActivitys[j].lateStart =
                        allActivitys[j].lateFinish - allActivitys[j].duration;
                }
            }
            allActivitys[i].lateStart = lateStart;
            allActivitys[i].lateFinish = lateFinish;
        }
        totalDays = allActivitys[lastActivity].earlyFinish;
    });
}
function calculateFloat() {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < activityCount - 1; i++) {
            allActivitys[i].totalFloat =
                allActivitys[i].lateFinish -
                    allActivitys[i].earlyStart -
                    allActivitys[i].duration;
        }
    });
}
function initializeCurrentStartAndFinish() {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < activityCount - 1; i++) {
            allActivitys[i].currentStart = allActivitys[i].earlyStart;
            allActivitys[i].currentFinish = allActivitys[i].earlyFinish;
        }
    });
}
function calcucateRSquare() {
    var rSquareTotal = 0;
    for (var i = 1; i <= totalDays; i++) {
        var rSquare = 0;
        var r = 0;
        for (var j = 0; j < activityCount; j++) {
            if (allActivitys[j].currentStart < i &&
                allActivitys[j].currentFinish >= i) {
                r += allActivitys[j].resource;
            }
        }
        rSquare = r * r;
        rSquareTotal += rSquare;
    }
    return rSquareTotal;
}
function calcucateRSquareParameterVersion(AllActivitys) {
    var rSquareTotal = 0;
    for (var i = 1; i <= totalDays; i++) {
        var rSquare = 0;
        var r = 0;
        for (var j = 0; j < AllActivitys.length; j++) {
            if (AllActivitys[j].currentStart < i &&
                AllActivitys[j].currentFinish >= i) {
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
function findFloatActivities() {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 1; i < activityCount - 1; i++) {
            if (allActivitys[i].totalFloat > 0) {
                floatActivitys.push(Object.assign({}, allActivitys[i]));
            }
        }
    });
}
function findLatestActivity() {
    var largestEarlyFinish = -10;
    var largestEarlyFinisherActivity;
    var index = -1;
    for (var i = 0; i < floatActivitys.length; i++) {
        if (floatActivitys[i].currentFinish != -1 &&
            floatActivitys[i].currentFinish > largestEarlyFinish) {
            largestEarlyFinish = floatActivitys[i].currentFinish;
            index = i;
            largestEarlyFinisherActivity = floatActivitys[i];
        }
        else if (floatActivitys[i].currentFinish == largestEarlyFinish) {
            largestEarlyFinisherActivity = floatActivitys[i];
            if (largestEarlyFinisherActivity.resource <
                floatActivitys[i].resource) {
                largestEarlyFinisherActivity = floatActivitys[i];
                largestEarlyFinish = floatActivitys[i].currentFinish;
                index = i;
            }
            else {
                largestEarlyFinish = largestEarlyFinisherActivity.currentFinish;
                index = i;
            }
        }
    }
    return index;
}
function calculateFloatSpace(latestActivity) {
    var floatSpace = latestActivity.lateFinish - latestActivity.currentFinish;
    var originalActivityIndex = stringToNumberConverter(latestActivity.name);
    for (var i = 1; i < activityCount - 1; i++) {
        if (relationMatrix[originalActivityIndex][i] == 1) {
            floatSpace = Math.min(floatSpace, allActivitys[i].currentStart - latestActivity.currentFinish);
            if (floatSpace < 0) {
                floatSpace = 0;
            }
        }
    }
    return floatSpace;
}
function countAvailableFloat() {
    var count = 0;
    for (var i = 0; i < floatActivitys.length; i++) {
        if (floatActivitys[i].currentFinish != -1) {
            count += 1;
        }
    }
    return count;
}
function burgessResourceLeveling() {
    return __awaiter(this, void 0, void 0, function* () {
        finalBurgessActivities = [...allActivitys];
        for (var l = 0; l < floatActivitys.length; l++) {
            allActivitysCopy = [...allActivitys];
            for (var k = 0; k < floatActivitys.length; k++) {
                if (countAvailableFloat() == 0) {
                    break;
                }
                var initialRsquare = Infinity;
                var calculatedRsquare = 0;
                var position = 0;
                var latestActivityIndex = findLatestActivity();
                var latestActivity = floatActivitys[latestActivityIndex];
                var originalActivityIndex = stringToNumberConverter(latestActivity.name);
                var originalActivity = Object.assign({}, allActivitys[originalActivityIndex]);
                var floatSpace = calculateFloatSpace(originalActivity);
                if (floatSpace == 0)
                    continue;
                for (var i = 0; i < floatSpace; i++) {
                    allActivitys[originalActivityIndex].currentStart =
                        originalActivity.currentStart + i + 1;
                    allActivitys[originalActivityIndex].currentFinish =
                        originalActivity.currentFinish + i + 1;
                    calculatedRsquare = calcucateRSquare();
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
                if (initialRsquare > totalRsquare) {
                    allActivitys = allActivitysCopy;
                }
                else {
                    totalRsquare = initialRsquare;
                }
            }
            if (calcucateRSquare() < totalRsquare) {
                totalRsquare = calcucateRSquare();
                finalBurgessActivities = [...allActivitys];
            }
            floatActivitys = [];
            yield findFloatActivities();
        }
    });
}
function checkIfValidActivity(AldlActivitys) {
    for (var i = 0; i < AldlActivitys.length; i++) {
        var relations = AldlActivitys[i].nextActivity;
        for (var j = 0; j < relations.length; j++) {
            for (var k = 0; k < AldlActivitys.length; k++) {
                if (AldlActivitys[k].name == AldlActivitys[i].nextActivity[j]) {
                    if (AldlActivitys[i].currentFinish >
                        AldlActivitys[k].currentStart) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}
function resultCalculation() {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < megaActivies.length; i++) {
            if (!checkIfValidActivity(megaActivies[i])) {
                continue;
            }
            var calculatedRsquare = calcucateRSquareParameterVersion(megaActivies[i]);
            if (calculatedRsquare < initialRsquare) {
                initialRsquare = calculatedRsquare;
                finalEstimatedActivities = [...megaActivies[i]];
            }
        }
    });
}
function estimatedResourceLeveling() {
    return __awaiter(this, void 0, void 0, function* () {
        var onnoNam = allActivitys.sort((a, b) => a.lateFinish - b.lateFinish);
        for (var i = 0; i < onnoNam.length; i++) {
            if (onnoNam[i].lateFinish == Infinity || onnoNam[i].name == "END") {
                continue;
            }
            var arr = megaActivies.length ? [...megaActivies] : [];
            for (var j = 0; j <= onnoNam[i].totalFloat; j++) {
                var temp = Object.assign({}, onnoNam[i]);
                temp.currentStart = temp.earlyStart + j;
                temp.currentFinish = temp.earlyFinish + j;
                for (var k = 0; k < megaActivies.length; k++) {
                    var copycopy = megaActivies[k].length
                        ? [...megaActivies[k]]
                        : [];
                    copycopy.push(temp);
                    arr.push(copycopy);
                    arr = arr.filter((a) => a !== megaActivies[k]);
                }
                if (!arr.length) {
                    arr.push([temp]);
                }
            }
            megaActivies = arr;
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield processInputLineByLine();
        initializeRelationMatrix();
        addRelationToMatrix();
        yield calculateESAndEF();
        yield calculateLSAndLF();
        yield calculateFloat();
        yield initializeCurrentStartAndFinish();
        totalRsquare = calcucateRSquare();
        yield findFloatActivities();
        originalAllActivitys = [...allActivitys];
        yield burgessResourceLeveling();
        console.log(finalBurgessActivities
            .map((a) => `${a.name}_${a.currentStart}_${a.currentFinish}`)
            .join("->"));
        console.log("Final Rsquare for burgess = " + totalRsquare);
        initialRsquare = Infinity;
        allActivitys = [...originalAllActivitys];
        yield estimatedResourceLeveling();
        yield resultCalculation();
        console.log(finalEstimatedActivities
            .map((a) => `${a.name}_${a.currentStart}_${a.currentFinish}`)
            .join("->"));
        console.log("Final Rsquare for emtimated brute force = " + initialRsquare);
    });
}
main();
//# sourceMappingURL=ResourceSheduling.js.map