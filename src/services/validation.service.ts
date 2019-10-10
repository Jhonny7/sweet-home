import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ValidationService {

  constructor(private translateService: TranslateService) { 
  }
  
  public getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': this.translateService.instant("REQUIRED"),
      'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPassword': 'Contraseña inválida. La contraseña debe contener al menos 6 caracteres, y un valor numérico.',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'seleccion': 'El campo es requerido, selecciona al menos uno',
      'invalidNumber': 'Ingrese un número válido'
    };

    return config[validatorName];
  }

  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match("^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$")) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

  static numberValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match("^[0-9]*$")) {
      return null;
    } else {
      return { 'invalidNumber': true };
    }
  }
}
