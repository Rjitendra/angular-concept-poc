import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { LogicalOperator } from '../../interfaces/cl-express-builder.inteface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cl-logical-operator',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatIconModule, MatMenuModule],
  templateUrl: './cl-logical-operator.component.html',
  styleUrl: './cl-logical-operator.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClLogicalOperatorComponent),
      multi: true
    }
  ]
})
export class ClLogicalOperatorComponent implements ControlValueAccessor {
  @Input() hideRemove!: boolean;
  @Output() addGroup: EventEmitter<void> = new EventEmitter<void>();
  @Output() addCondition: EventEmitter<void> = new EventEmitter<void>();
  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  LogicalOperator = LogicalOperator;
  operator: LogicalOperator = LogicalOperator.And;
  disable!: boolean;

  

  newCondition(): void {
    this.addCondition.emit();
  }

  newGroup(): void {
    this.addGroup.emit();
  }

  change(e: MatButtonToggleChange): void {
    this.operator = e.value as LogicalOperator;
    this.onChange(this.operator);
  }

  removeGroup(): void {
    this.remove.emit();
  }

  /* ControlValueAccessor implementation */

  writeValue(value: LogicalOperator): void {
    this.operator = value || LogicalOperator.And;
  }

  registerOnChange(fn: (value: LogicalOperator) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }
  private onChange: (value: LogicalOperator) => void = () => {};
  private onTouched: () => void = () => {};
}
