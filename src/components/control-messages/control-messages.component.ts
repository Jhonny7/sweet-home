import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-control-messages',
  template: `<div *ngIf="errorMessage !== null" class="validators animated slideInRight">{{errorMessage}}</div>`
})
export class ControlMessagesComponent {
  @Input() control: FormControl;
  constructor(private validationService:ValidationService) { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return this.validationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }
}
