import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-autocomplete-element',
  templateUrl: './autocomplete-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutocompleteElementComponent),
    multi: true,
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => AutocompleteElementComponent),
    multi: true,
  }],
})
export class AutocompleteElementComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @ViewChildren('itemElement') itemElements: QueryList<ElementRef>;
  @Input() items: any[] = [];
  @Input() noVarsMessage = 'Нет вариантов';

  private sub: Subscription;
  public cursorPosition = -1;

  public control = new FormControl('', this.autocompleteValidator());
  public isItemsOpen: boolean;

  onChange = (value: string) => { };
  onTouched = () => { };

  @HostListener('document:click') clickedOutside() {
    this.hideItems();
  }

  @HostBinding('style.opacity')
  get opacity() {
    return this.control.disabled ? 0.35 : 1;
  }

  ngOnInit() {
    this.sub = this.control.valueChanges
      .subscribe(value => {
        this.onChange(value);
        this.onTouched();
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  onSelect(item: string) {
    this.hideItems();
    this.cursorPosition = 0;
    this.control.setValue(item);
  }

  onKeyDown(event: KeyboardEvent) {
    this.showItems();
    if (event.keyCode === 40) { // down
      this.cursorPosition = Math.min(this.items.length - 1, this.cursorPosition + 1);
    }

    if (event.keyCode === 38) { // up
      this.cursorPosition = Math.max(0, this.cursorPosition - 1);
    }

    if (event.keyCode === 13) { // enter
      this.onSelect(this.items[this.cursorPosition]);
    }

    const itemElementRef = this.itemElements.toArray()[this.cursorPosition].nativeElement as HTMLElement;
    itemElementRef.scrollIntoView(false);
  }

  toggleItems() {
    if (this.control.enabled) {
      this.isItemsOpen = !this.isItemsOpen;
    }
  }

  hideItems() {
    this.isItemsOpen = false;
  }

  showItems() {
    this.isItemsOpen = true;
  }

  writeValue(value: string) {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.control.disable()
      : this.control.enable();
  }

  private autocompleteValidator(): ValidatorFn {
    return (c: FormControl): ValidationErrors | null => {
      const isInList = this.items.find(el => el === c.value);
      return isInList
        ? null
        : { notInList: true };
    };
  }

  // returns null when valid else the validation object
  public validate(c: FormControl): ValidationErrors | null {
    return this.control.errors;
  }
}
