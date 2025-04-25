export const random = (num : number) =>{

    const longString : string = "qwertyuiop098765443221QWERTYUIOP";

    let res = "";
    for(let i = 0;i < num;i++){
        res += longString[Math.floor(Math.random() * longString.length)]
    }


    return res;


}