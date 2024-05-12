import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[noNumberInclude]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: NoNumberIncludeDirective, multi: true }]
})
export class NoNumberIncludeDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    let controlValue = control.value as string;
    return /\d/.test(controlValue) ? {noNumberInclude : true} : null
  }
}