export class ApiResponse{
    statusCode:number;
    data:any;
    message:string;
    success:boolean;


    constructor(statusCode:number,data : unknown,message="success"){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success= statusCode < 400
    }
}