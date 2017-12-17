import { EventEmitter } from "@angular/core";

export class ParametersService {

     parameterEdited = new EventEmitter<any>(); 

    private Paramters  =[];

    getParameters()
    {
        return this.Paramters;
    }

    setParameters(data)
    {   
        this.Paramters.push(data);
    }
}