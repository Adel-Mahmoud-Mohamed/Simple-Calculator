import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { OperationService } from './OperationService';

@Component({
  selector: 'app-my-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'calculator-app';
  operation_screen: string = '';
  expression: string = '';
  result_screen: string = '0';
  isdot_clicked: boolean = false;
  isbinary_clicked: boolean = false;
  isunary_clicked: boolean = false;
  error_occured: boolean = false;
  first_operand: number = 0;
  second_operand: number = 0;
  first_operand_str: string = '';
  second_operand_str: string = '';
  first_operand_taken: boolean = false;
  second_operand_taken: boolean = false;
  isequal_clicked: boolean = false;
  current_binary_operation: string = '';
  nested_res: string = '';
  new_operator: string = '';
  nested: boolean = false;

  constructor(private calculatorService: OperationService) {}

  public send_expression(
    first_op: string,
    operator: string,
    second_op: string
  ): void {
    this.calculatorService
      .evaluateOperation(first_op, operator, second_op)
      .subscribe({
        next: (x) => {
          if (x == null) {
            this.error_occured = true;
            this.result_screen = 'Error occured';
          } else {
            this.result_screen = x;
          }
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        },
      });
  }

  public send_unary_expression(operator: string, operand: string): void {
    if (operator == '1/(') operator = 'rev(';
    this.calculatorService.handles_unary(operator, operand).subscribe({
      next: (x) => {
        if (x == null) {
          this.error_occured = true;
          this.result_screen = 'Error occured';
        } else {
          if (
            (!this.isunary_clicked && !this.first_operand_taken) ||
            (this.isunary_clicked && this.first_operand_str != '')
          ) {
            this.first_operand = Number(x);
            this.result_screen = String(this.first_operand);
          } else {
            this.second_operand = Number(x);
            this.result_screen = String(this.second_operand);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public send_nested_expression(
    first_op: string,
    current_operator: string,
    second_op: string,
    new_operator: string
  ): void {
    this.calculatorService
      .evaluateOperation(first_op, current_operator, second_op)
      .subscribe({
        next: (x) => {
          if (x == null) {
            this.error_occured = true;
            this.result_screen = 'Error occured';
          } else {
            this.result_screen = x;
            this.operation_screen =
              this.result_screen + ' ' + this.new_operator;
            this.first_operand = Number(this.result_screen);
            this.first_operand_taken = true;
            this.second_operand_taken = false;
            this.result_screen = '0';
            this.current_binary_operation = new_operator;
            this.isdot_clicked = false;
            this.first_operand_str = '';
            this.second_operand_str = '';
            this.isunary_clicked = false;
            this.nested = true;
          }
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        },
      });
  }

  number_clicked(num: string) {
    if (this.error_occured) {
      this.clear();
      return;
    }
    if (this.isequal_clicked) {
      this.clear();
    }
    if (this.result_screen.length == 16) return;
    if (num != '.') {
      if (this.result_screen == '0') {
        this.result_screen = num;
      } else {
        this.result_screen += num;
      }
    } else {
      if (!this.isdot_clicked) {
        this.isdot_clicked = true;
        this.result_screen += num;
      }
    }
  }

  delete() {
    if (this.error_occured) {
      this.clear();
      return;
    }
    if (this.isequal_clicked) {
      this.clear();
    }
    if (this.result_screen.length == 1) {
      this.result_screen = '0';
    } else {
      if (this.result_screen.charAt(this.result_screen.length - 1) == '.')
        this.isdot_clicked = false;
      this.result_screen = this.result_screen.substring(
        0,
        this.result_screen.length - 1
      );
    }
  }

  binary_clicked(operator: string) {
    if (this.error_occured) {
      this.clear();
      return;
    }
    if (this.isequal_clicked) {
      this.operation_screen = '';
      this.isequal_clicked = false;
    }

    if (!this.isbinary_clicked) {
      this.isbinary_clicked = true;
      if (this.first_operand_str != '') {
        this.operation_screen += ' ' + operator;
      } else {
        this.first_operand_taken = true;
        this.first_operand = Number(this.result_screen);
        this.operation_screen += this.first_operand + ' ' + operator;
      }
    } else {
      this.new_operator = operator;
      if (
        this.operation_screen.charAt(this.operation_screen.length - 1) == ')'
      ) {
        this.send_nested_expression(
          String(this.first_operand),
          this.current_binary_operation,
          String(this.second_operand),
          operator
        );
        return;
      } else {
        this.send_nested_expression(
          String(this.first_operand),
          this.current_binary_operation,
          String(Number(this.result_screen)),
          operator
        );
        return;
      }
    }
    this.current_binary_operation = operator;
    this.result_screen = '0';
    this.isdot_clicked = false;
    this.first_operand_str = '';
    this.isunary_clicked = false;
  }

  clear() {
    this.operation_screen = '';
    this.result_screen = '0';
    this.isdot_clicked = false;
    this.isbinary_clicked = false;
    this.first_operand = 0;
    this.second_operand = 0;
    this.current_binary_operation = '';
    this.error_occured = false;
    this.isunary_clicked = false;
    this.first_operand_str = '';
    this.second_operand_str = '';
    this.isequal_clicked = false;
    this.first_operand_taken = false;
    this.second_operand_taken = false;
  }

  equla_clicked() {
    if (this.error_occured) {
      this.clear();
      return;
    }
    if (!this.isequal_clicked) {
      this.isequal_clicked = true;
      if (this.second_operand_str != '' || this.first_operand_str != '') {
        this.operation_screen += ' =';
      } else {
        this.second_operand = Number(this.result_screen);
        this.second_operand_taken = true;
        this.operation_screen += ' ' + this.second_operand + ' ' + '=' + ' ';
      }
      if (this.first_operand_taken && this.second_operand_taken) {
        this.send_expression(
          String(this.first_operand),
          this.current_binary_operation,
          String(this.second_operand)
        );
      }

      this.isdot_clicked = false;
      this.isbinary_clicked = false;
      this.isunary_clicked = false;
      this.first_operand_str = '';
      this.second_operand_str = '';
      this.first_operand_taken = false;
      this.second_operand_taken = false;
      this.expression =
        this.first_operand +
        ' ' +
        this.current_binary_operation +
        ' ' +
        this.second_operand;
      this.nested = false;
    }
  }

  unary_clicked(operator: string) {
    if (this.error_occured) {
      this.clear();
      return;
    }
    if (!this.isunary_clicked) {
      this.isunary_clicked = true;
      if (!this.first_operand_taken) {
        if (this.isequal_clicked) {
          this.operation_screen = '';
          this.isequal_clicked = false;
        }
        this.operation_screen = '';
        this.first_operand_taken = true;
        this.first_operand_str += operator + Number(this.result_screen) + ')';
        this.operation_screen += this.first_operand_str;
        this.send_unary_expression(
          operator,
          String(Number(this.result_screen))
        );
      } else {
        this.second_operand_taken = true;
        this.second_operand_str += operator + Number(this.result_screen) + ')';
        this.operation_screen += this.second_operand_str;
        this.send_unary_expression(
          operator,
          String(Number(this.result_screen))
        );
      }
    } else {
      if (this.first_operand_str != '') {
        let tmp: string = this.first_operand_str;
        this.first_operand_str = operator + this.first_operand_str + ')';
        this.operation_screen = this.operation_screen.replace(
          tmp,
          this.first_operand_str
        );
        this.send_unary_expression(operator, String(this.first_operand));
      } else {
        let tmp: string = this.second_operand_str;
        this.second_operand_str = operator + this.second_operand_str + ')';
        this.operation_screen = this.operation_screen.replace(
          tmp,
          this.second_operand_str
        );
        this.send_unary_expression(operator, String(this.second_operand));
      }
    }
  }

  percentage() {
    if (!this.first_operand_taken) {
      this.first_operand = 0;
      this.result_screen = String(this.first_operand);
    } else {
      let tmp: number =
        (Number(this.result_screen) / 100.0) * this.first_operand;
      this.result_screen = String(tmp);
    }
  }
}
