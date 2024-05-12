import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[noSpaceInclude]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: NoSpaceIncludeDirective, multi: true }]
})
export class NoSpaceIncludeDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    let controlValue = control.value as string;

    if (controlValue != null)
      return controlValue.indexOf(' ') >=0 ? {noSpaceInclude : true} : null
    return null
  }
}