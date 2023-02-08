package com.example.calculator_backend;


public class expression_handler {
 
	public String evaluate(String first_op,String operator,String second_op) {
		String resultstr = "";
		double result = 0;
		
		 
	    double first_operand = Double.parseDouble(first_op);
	    
	    double second_operand = Double.parseDouble(second_op);
	    
	    
	    switch(operator) {
	      case "+":
	    	result = first_operand + second_operand;
	    	break;
	      case "-":
	    	  result = first_operand - second_operand;
	    	  break;
	      case "x":
	    	   result = first_operand * second_operand;
	    	   break;
	      case "÷":
	    	   if(second_operand == 0) return null;
	    	   result = first_operand / second_operand;
	    	   break;
	    }
         
	    double Max = (2-Math.pow(2.0,-52.0))*Math.pow(2,1023);
        if(Math.abs(result) > Max){
            return null;
        }
        
		if(result - (int)result == 0) {
			resultstr += (int)result;
			return resultstr;
		}
		
		resultstr += result;
		return resultstr;
	}
	
	
    public String  handles_unary(String op, String operand){
		    double result = 0;
		    double number = Double.parseDouble(operand);
		    

		    
		    String resultString = "";
		    
		    switch(op){
		      case "√(":
		    	  if(number < 0) return null;
		          result =  Math.sqrt(number);
		          break;
		      case "sqr(":
		          result =  Math.pow(number,2.0);
		          break;
		      case "rev(":
		            if(number == 0)return null;
		            result = 1.0/number;
		            break;
		      case "negate(":
		    	    result = number * -1 ;
		    	    break;
		      case "%":
		    	    result = number / 100.0;
		    	    break;
		    }
		    
		    double Max = (2-Math.pow(2.0,-52.0))*Math.pow(2,1023);
			
	        if(Math.abs(result) > Max){
	            return null;
	        }

		    if(result - (int) result == 0) {
		    	resultString += (int)result;
		    	return resultString;
		    }
		    resultString += result;
		    return resultString;
		  }
}
