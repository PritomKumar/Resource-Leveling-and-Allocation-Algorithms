export {};

class Activity {
    name: string;
    description: string;
    resource: number;
    duration: number;
    earlyStart: number = 0;
    earlyFinish: number = 0;
    lateStart: number = 0;
    lateFinish: number = 0;
    totalFloat: number = 0;

    constructor(
        name: string,
        resource: number,
        duration: number,
        description: string
    ) {
        this.name = name;
        this.duration = duration;
        this.resource = resource;
        this.description = description;
    }
}

let str = "sd a  dfs sdf ";
console.log(str);
