/**
 * This class has static methods that will be used to generate debug statements
 */
export default class debugHelper{
    /**
     * Prints a divider with the statement 'END of DEBU for <funcName> of <className>
     * @param funcName
     * @param className
     */
    static printEnd(funcName: string, className: string):void {
        let prefix = "/********** END OF DEBUG for "
        prefix += funcName + " FROM " + className
        const suffix = " **********/\n\n"
        prefix += suffix
        console.log(prefix)
    }

    /**
     * Prints a single line divider followed by newline char to the console "------...\n"
     */
    static printSingleLineDivider(): void {
        const dividerSymbol = "-";
        const mult = 30;
        let divider = dividerSymbol.repeat(mult)
        divider += "\n"
        console.log(divider)
    }
}