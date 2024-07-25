import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatFormFieldControl } from '@angular/material/form-field';
import { BehaviorSubject, Subject, Subscription, debounceTime } from 'rxjs';

import { Field } from '../../interfaces/cl-express-builder.inteface';
import { ClExpressionService } from '../../services/cl-expression.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'cl-field-select',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './cl-field-select.component.html',
  styleUrls: ['./cl-field-select.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: ClFieldSelectComponent,
    },
  ],
})
export class ClFieldSelectComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<string>
{
  static nextId = 0;
  @HostBinding() id = `field-select-input-${ClFieldSelectComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  @Input() allFields!: Field[];
  @Output() fieldSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('selectTrigger') selectTrigger!: MatAutocompleteTrigger;
  @ViewChild('input', { read: ElementRef }) private input!: ElementRef;

  fielteredOptions: BehaviorSubject<Field[]> = new BehaviorSubject<Field[]>([]);
  inputValueChange: Subject<string> = new Subject();
  inputValueSubs!: Subscription;
  inputValue: string = '';
  selectedFieldChange: Subject<Field> = new Subject();
  selectedFieldSubs!: Subscription;
  selectedField?: Field;

  /* MatFormFieldControl implementation */

  controlType = 'field-select-input';
  focused = false;
  errorState = false;
  stateChanges = new Subject<void>();

  private _disabled!: boolean;
  private _placeholder!: string;
  private _required = false;

  constructor(
    private expService: ClExpressionService,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    this.labelByValue = this.labelByValue.bind(this);

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  @Input()
  get value(): string {
    return this.selectedField?.name || '';
  }
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  @Input()
  get required() {
    return this._required;
  }
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }
  get empty() {
    return this.selectedField == null;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  set value(value: string) {
    this.writeValue(value);
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  ngOnInit() {
    this.fielteredOptions.next(this.allFields);

    this.selectedFieldSubs = this.selectedFieldChange.subscribe((data) => {
      this.selectedField = data;
      this.onChange(data ? data.name : '');
      this.errorState = this.ngControl ? this.ngControl.invalid! : false;
    });

    this.inputValueSubs = this.inputValueChange
      .pipe(debounceTime(150))
      .subscribe((data) => {
        this.filterOptions(data);
      });
  }

  ngOnDestroy() {
    if (this.inputValueSubs) this.inputValueSubs.unsubscribe();
    if (this.selectedFieldSubs) this.selectedFieldSubs.unsubscribe();

    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);

    this.fielteredOptions.complete();
    this.inputValueChange.complete();
    this.selectedFieldChange.complete();
  }

  blur(inputValue: string): void {
    this.setFromLabel(inputValue);

    if (this.ngControl) {
      this.errorState = this.ngControl.invalid!;
    }
  }

  public clear(): void {
    this.setFromName('');
    this.filterOptions('');
    const inputElement = this.input.nativeElement as HTMLInputElement;
    inputElement.value = '';
    setTimeout(() => {
      const selectTrigger = this.selectTrigger;
      selectTrigger.openPanel();
      inputElement.focus();
    });
  }

  filterOptions(contains: string): void {
    if (contains) {
      const values = this.allFields.filter(
        (item) => item.label.toLowerCase().indexOf(contains.toLowerCase()) >= 0
      );
      this.fielteredOptions.next(values);
    } else {
      this.fielteredOptions.next(this.allFields);
    }
  }

  keyup(inputValue: string): void {
    this.inputValueChange.next(inputValue);
  }

  labelByValue(value: string): string {
    return this.expService.fieldLabel(value);
  }

  applyChange(value: Field): void {
    this.selectedFieldChange.next(value);
  }

  optionSelected(e: MatAutocompleteSelectedEvent): void {
    const selectedValue = e.option.value as string;
    this.setFromName(selectedValue);
    this.fieldSelected.emit(selectedValue);
  }

  setFromLabel(label: string): void {
    const option = this.expService.fieldByLabel(label);

    if (!option && !this.selectedField) {
      return;
    }

    if ((!option && this.selectedField) || (option && !this.selectedField)) {
      if (option) {
        this.applyChange(option);
      }
      return;
    }

    if (option && option.name !== this.selectedField?.name) {
      this.applyChange(option);
    }
  }

  setFromName(fieldName: string): void {
    const option = this.expService.fieldOptions(fieldName);
    if (option) {
      this.applyChange(option);
    }
  }
  trackByFn(index: number): number {
    return index; // or item.id if your items have unique ids
  }
  /* ControlValueAccessor implementation */

  writeValue(value: string): void {
    const field = this.expService.fieldOptions(value);
    if (field) {
      this.selectedField = field;
      this.inputValue = this.selectedField.label;
    } else {
      this.selectedField = undefined; // Or handle it appropriately if you don't want to set it to null
      this.inputValue = '';
    }
    this.stateChanges.next();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      const inputElement = this.elRef.nativeElement.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
}
