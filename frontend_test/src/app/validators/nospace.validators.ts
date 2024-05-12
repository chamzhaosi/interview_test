import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[onSpaceInclude]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: OnSpaceIncludeDirective, multi: true }]
})
export class OnSpaceIncludeDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    let controlValue = control.value as string;
    return controlValue.indexOf(' ') >=0 ? {onSpaceInclude : true} : null
  }
}