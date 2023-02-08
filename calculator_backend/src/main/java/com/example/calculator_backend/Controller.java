package com.example.calculator_backend;

import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RestController;

@RestController

@CrossOrigin(origins = "http://localhost:4200")

public class Controller {

  @PostMapping(value = "/operation/{first_op}/{operator}/{second_op}")
  
  public String handling_request(@PathVariable("first_op") String first_op, @PathVariable("operator") String operator, @PathVariable("second_op") String second_op) {
	     final expression_handler calc = new expression_handler();
	     return calc.evaluate(first_op,operator,second_op);
  }

  @PostMapping(value = "/operation/{operator}/{operand}")

  public String handling_request_unary(@PathVariable("operator") String operator, @PathVariable("operand") String operand ) {
	  final expression_handler calc = new expression_handler();
	  return calc.handles_unary(operator, operand);
  }
  
}
