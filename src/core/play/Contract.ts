import {
    Trump
}
from "../../types/bridge";


export class Contract {


constructor(

    public level:number,

    public trump:Trump,

    public declarer:string

){}



requiredTricks(){

    return this.level + 6;

}


toString(){

    return `${this.level}${this.trump}`;

}


}