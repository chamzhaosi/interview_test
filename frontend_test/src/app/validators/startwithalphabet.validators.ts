import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[startsWithAlphabet]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: StartsWithAlphabetDirective, multi: true }]
})
export class StartsWithAlphabetDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    return /^[A-Za-z]/.test(control.value) ? null : { 'startsWithAlphabet': true };
  }
}
