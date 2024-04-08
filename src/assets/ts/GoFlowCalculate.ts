import {BasicGoFlowCalculate} from "@/assets/ts/BasicGoFlowCalculate";
import {
    GoFlowState21,
    GoFlowState26,
    GoFlowState27,
    GoFlowState35,
    GoFlowState37, GoFlowState39,
    GoFlowStateBasic
} from "@/assets/ts/interface";

class GoFlowCalculate21 extends BasicGoFlowCalculate{


    goFlowState: GoFlowState21;

    calculateOutValues(): number {
        return this.goFlowState.Pg * this.inValue;
    }

}


class GoFlowCalculate22 extends BasicGoFlowCalculate{

    calculateOutValues(): number {
        let temp = 1;
        for (let i = 0; i < this.inValueArray.length; i++) {
            temp = temp * ( 1 - this.inValueArray[i] );
        }
        return 1 - temp;
    }

}

class GoFlowCalculate23 extends BasicGoFlowCalculate{

    calculateOutValues(): number {
        return 1 - this.inValue;
    }

}

class GoFlowCalculate25 {

    id: string;
    basic: GoFlowStateBasic;


    calculateOutValues(): number {
        return 0;
    }


}

class GoFlowCalculate26 extends BasicGoFlowCalculate{

    goFlowState: GoFlowState26;

    subInputValueArray: number[];


    calculateOutValues(): number {

        let nowSubInputValue = 0;
        if( this.timePoint === 1)
            nowSubInputValue  = this.goFlowState.Pp;
        else
            nowSubInputValue = this.subInputValueArray[this.timePoint -1]
                + ( 1- this.subInputValueArray[this.timePoint -1] ) * this.goFlowState.Pg * this.inValue2;


        return nowSubInputValue * this.inValue1;
    }

}

class GoFlowCalculate27 extends BasicGoFlowCalculate{

    goFlowState: GoFlowState27;

    subInputValueArray: number[];


    calculateOutValues(): number {

        let nowSubInputValue = 0;
        if( this.timePoint === 1)
            nowSubInputValue  = 1 - this.goFlowState.Pp;
        else
            nowSubInputValue = this.subInputValueArray[this.timePoint -1] * ( 1 - this.inValue2  * this.goFlowState.Pg );

        return nowSubInputValue * this.inValue1;
    }

}

class GoFlowCalculate30 extends BasicGoFlowCalculate{

    calculateOutValues(): number {
        let temp = 1;
        for (let i = 0; i < this.inValueArray.length; i++) {
            temp = temp *  this.inValueArray[i] ;
        }
        return temp;
    }

}

class GoFlowCalculate35 extends BasicGoFlowCalculate{

    goFlowState: GoFlowState35;

    calculateOutValues(): number {
        let time = 0;
        for (let i = 0; i < this.timePoint; i++) {
            time = time + this.allTimePointValueArray[i];
        }
        return this.inValue1 * Math.exp( - this.goFlowState.lambda * time );
    }

}

class GoFlowCalculate39 extends BasicGoFlowCalculate{

    goFlowState: GoFlowState39;

    subInputValueArray: number[];


    calculateOutValues(): number {

        let nowSubInputValue1 = 0;  // 打开
        let nowSubInputValue2 = 0;  // 关闭
        if( this.timePoint === 1){
            nowSubInputValue1  = this.goFlowState.Ppc;
            nowSubInputValue2  = this.goFlowState.Ppo;
        }
        else{
            nowSubInputValue1 = this.subInputValueArray[this.timePoint -1]
                + ( 1- this.subInputValueArray[this.timePoint -1] ) * this.goFlowState.Po * this.inValue2;
            nowSubInputValue2 = this.subInputValueArray[this.timePoint -1] * ( 1 - this.inValue3  * this.goFlowState.Pc );
        }
        if (this.inValue2 === 1 && this.inValue3 !== 1 )  // 当 当前时间点的导通信号为1时  输出导通概率
            return nowSubInputValue1 * this.inValue1;
        else if ( this.inValue3 === 1 && this.inValue2 !== 1)  // 当 当前时间点的关闭信号为1时  输出关闭概率
            return nowSubInputValue2 * this.inValue1;

    }

}



export {

    GoFlowCalculate21,
    GoFlowCalculate22,
    GoFlowCalculate23,
    GoFlowCalculate25,
    GoFlowCalculate26,
    GoFlowCalculate27,
    GoFlowCalculate30,
    GoFlowCalculate35,
    GoFlowCalculate39,

}