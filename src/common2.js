class Person{
    constructor(name="noname",age = 20){
        this.name = name;
        this.age = age;
    }
    toJSON(){
        const obj = {
            name : this.name,
            age : this.age,
        };
        return JSON.stringify(obj);
    }
}
export default Person;//default 只能使用一次 export無限制