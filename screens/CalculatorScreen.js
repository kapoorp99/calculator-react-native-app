import React from 'react';
import {StyleSheet,PanResponder,Dimensions, Text, View} from 'react-native';
import CalcButton from "../components/CalcButton";
import {CalcDisplay} from "../index";

require("./../lib/swisscalc.lib.format.js");
require("./../lib/swisscalc.lib.operator.js");
require("./../lib/swisscalc.lib.operatorCache.js");
require("./../lib/swisscalc.lib.shuntingYard.js");
require("./../lib/swisscalc.calc.calculator.js");
require("./../lib/swisscalc.display.memoryDisplay");
require("./../lib/swisscalc.display.numericDisplay");

export default class CalculatorScreen extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            display: "0",
            orientation: "portrait",
        };
        // Initialize calculator
        this.oc = global.swisscalc.lib.operatorCache;
        this.calc = new global.swisscalc.calc.calculator();

        // Listen for orientation change
        Dimensions.addEventListener("change", ()=>{
            const {width, height} = Dimensions.get("window");
            var orientation = (width > height) ? "landscape" : "portrait";
            this.setState({orientation:orientation});
        });

        //Initialize PanResponders
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                if(Math.abs(gestureState.dx) >= 50){
                    this.onBackspacePress();
                }
            },
        });
    }
    // Occurs when a digit is pressed....
    onDigitPress = (digit)=>{
        this.calc.addDigit(digit);
        this.setState({display:this.calc.getMainDisplay()});
    }

    // Occurs when the clear is pressed....
    onClearPress = ()=>{
        this.calc.clear();
        this.setState({display:this.calc.getMainDisplay()});
    }

    // Occurs when the plus minus is pressed
    onPlusMinusPress = ()=>{
        this.calc.negate();
        this.setState({display:this.calc.getMainDisplay()});
    }

    // Occurs when a binary operator is pressed
    onBinaryOperatorPress = (operator)=>{
        this.calc.addBinaryOperator(operator);
        this.setState({display:this.calc.getMainDisplay()});
    }

    // Occurs when an unary operator is pressed
    onUnaryOperatorPress = (operator)=>{
        this.calc.addUnaryOperator(operator);
        this.setState({display:this.calc.getMainDisplay()});
    }

    // Occurs when equal is pressed
    onEqualPress = ()=>{
        this.calc.equalsPressed();
        this.setState({display:this.calc.getMainDisplay()});
    }

    // Occurs when a backspace is pressed
    onBackspacePress = ()=>{
        this.calc.backspace();
        this.setState({display:this.calc.getMainDisplay()});
    }

    renderPortrait() {
        return (
            <View style={{flex:1}}>
                <View style={styles.displayContainer} { ...this.panResponder.panHandlers }>
                    <CalcDisplay display={this.state.display} />
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonRow}>
                        <CalcButton onPress={this.onClearPress} title="C" color="red" backgroundColor="#B0BEC5" />
                        <CalcButton onPress={this.onPlusMinusPress} title="+/-" color="red" backgroundColor="#B0BEC5" />
                        <CalcButton onPress={()=>{this.onUnaryOperatorPress(this.oc.PercentOperator)}} title="%" color="red" backgroundColor="#B0BEC5" />
                        <CalcButton onPress={()=>{this.onBinaryOperatorPress(this.oc.DivisionOperator)}} title="/" color="red" backgroundColor="#B0BEC5" />
                    </View>
                    <View style={styles.buttonRow}>
                        <CalcButton onPress={()=>{this.onDigitPress("7")}} title="7" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onDigitPress("8")}} title="8" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onDigitPress("9")}} title="9" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onBinaryOperatorPress(this.oc.MultiplicationOperator)}} title="x" color="red" backgroundColor="#B0BEC5" />
                    </View>
                    <View style={styles.buttonRow}>
                        <CalcButton onPress={()=>{this.onDigitPress("4")}} title="4" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onDigitPress("5")}} title="5" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onDigitPress("6")}} title="6" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onBinaryOperatorPress(this.oc.SubtractionOperator)}} title="-" color="red" backgroundColor="#B0BEC5" />
                    </View>
                    <View style={styles.buttonRow}>
                        <CalcButton onPress={()=>{this.onDigitPress("1")}} title="1" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onDigitPress("2")}} title="2" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onDigitPress("3")}} title="3" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton onPress={()=>{this.onBinaryOperatorPress(this.oc.AdditionOperator)}} title="+" color="red" backgroundColor="#B0BEC5" />
                    </View>
                    <View style={styles.buttonRow}>
                        <CalcButton onPress={()=>{this.onDigitPress("0")}} title="0" color="red" backgroundColor="#9E9E9E" />
                        <CalcButton title="." color="red" backgroundColor="#B0BEC5" />
                        <CalcButton onPress={this.onEqualPress} title="=" color="red" backgroundColor="#B0BEC5" />
                    </View>
                </View>
            </View>
        );
    }

    renderLandScape() {
        return (
            <View style={{flex:1, paddingTop: 50}}>
                <Text style={{color: "white"}}>Landscape Mode</Text>
            </View>
        );
    }

    render() {
        var view = (this.state.orientation=="portrait") ? this.renderPortrait():this.renderLandScape();
        return(
            <View style={styles.container}>
                {view}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{flex: 1,backgroundColor:"black", alignItems: "center",},
    buttonRow:{flexDirection:"row",justifyContent:"space-between",},
    displayContainer:{flex:1,justifyContent: "space-between",paddingRight: 20},
    buttonContainer:{padding:20,margin:4,alignItems:"center"},
});
