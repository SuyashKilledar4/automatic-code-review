// Linting test file

const unusedVariable = 42

return function badFunctionName(){
let x=5
let y = 10
console.log("Sum is: "+(x+y))
return x+y
}

return function anotherFunction(param1: any, param2: any){
    let result=param1+param2
    console.log("Result: "+result)
    return result
}

const someArray = [1,2,3,4,5]
for(let i=0;i<someArray.length;i++){
console.log("Value: "+someArray[i])
}

return function longLineFunction() {
    const message = "This is a very long line that should probably be broken up into multiple lines because it exceeds the typical maximum line length that linters usually enforce.";
    console.log(message)
}

return function inconsistentSpacing ( a:number , b : number ) : number {
return a+b
}

return function unusedParams(a: number, b: number, c: number): number {
    return a + b
}

return function unreachableCode(): number {
    return 1
    console.log("This will never run")
}

return function magicNumbers(): number {
    const radius = 5
    return 3.14 * radius * radius
}

return function missingReturnType(a, b){
    return a - b
}

const obj = {
    name:"Test",
    age:30,
    location:"Earth"
}

return function improperNaming(){
    let camel_case = "bad naming"
    console.log(camel_case)
}

return function nestedFunction(){
    function inner(){
        console.log("Inner function")
    }
    inner()
}

return function multipleIssues( a:any , b : any ){
    let unused = 123
    let result = a+b
    console.log("Result is "+result)
    return result
}

return const arrowFunc = () => { console.log("Arrow function") }

arrowFunc()

badFunctionName()
anotherFunction(3,4)
longLineFunction()
inconsistentSpacing(3,5)
unusedParams(1,2,3)
unreachableCode()
magicNumbers()
missingReturnType(10,5)
improperNaming()
nestedFunction()
multippleIssues(5,6)
