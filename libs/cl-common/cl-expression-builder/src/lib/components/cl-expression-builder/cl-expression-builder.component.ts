import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  QueryExpression,
  Field,
  ExpressionChangeEvent,
  LogicalOperator
} from '../../interfaces/cl-express-builder.inteface';
import { ClExpressionService } from '../../services/cl-expression.service';
import { ClConditionComponent } from '../cl-condition/cl-condition.component';
import { ClFieldSelectComponent } from '../cl-field-select/cl-field-select.component';
import { ClLogicalOperatorComponent } from '../cl-logical-operator/cl-logical-operator.component';
@Component({
  selector: 'cl-expression-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClConditionComponent,
    ClFieldSelectComponent,
    ClLogicalOperatorComponent
  ],
  templateUrl: './cl-expression-builder.component.html',
  styleUrl: './cl-expression-builder.component.scss',
  providers: [ClExpressionService]
})
export class ClExpressionBuilderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data!: QueryExpression;
  @Input() fields: Field[] = [];
  @Output() valuechange: EventEmitter<ExpressionChangeEvent> =
    new EventEmitter<ExpressionChangeEvent>();

  form!: FormGroup;

  invalid = false;
  valid = true;

  private formValueSubs!: Subscription;

  constructor(
    private expService: ClExpressionService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.expService.setFields(this.fields);
    this.initialize();
    this.subscribeToForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.formValueSubs) {
        this.formValueSubs.unsubscribe();
      }
      this.initialize();
      this.subscribeToForm();
      this.emitChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.formValueSubs) {
      this.formValueSubs.unsubscribe();
    }
  }

  addCondition(host: FormGroup): void {
    const rules = this.getRulesFormArray(host);
    rules.push(this.expService.createCondition('', undefined, ''));
  }

  addGroup(host: FormGroup): void {
    const rules = this.getRulesFormArray(host);
    rules.push(this.expService.createGroup(LogicalOperator.And));
  }

  emitChanges(): void {
    this.valuechange.emit({
      valid: this.form.valid,
      expression: this.form.value as QueryExpression,
    });
  }

  extractRules(formGroup: FormGroup): AbstractControl[] {
    return (formGroup.get('rules') as FormArray)?.controls || [];
  }

  isCondition(value: AbstractControl): boolean {
    return value.get('fieldName') != null;
  }

  isGroup(value: AbstractControl): boolean {
    return value.get('rules') != null;
  }

  isFirstCondition(index: number, rules: FormArray): boolean {
    let firstCondIndex = -1;

    for (let i = 0; i < rules.length; i++) {
      if (this.isCondition(rules.at(i))) {
        firstCondIndex = i;
        break;
      }
    }

    return index === firstCondIndex;
  }

  isLastCondition(index: number, rules: FormArray): boolean {
    if (index >= rules.length - 1) {
      return true;
    }

    let result = false;

    for (let i = index + 1; i < rules.length; i++) {
      result = this.isGroup(rules.at(i));
      if (!result) {
        break;
      }
    }

    return result;
  }

  removeItem(index: number, parent: FormGroup): void {
    if (!parent) {
      return;
    }

    const rules = parent?.get('rules') as FormArray;

    if (rules instanceof FormArray) {
      rules.removeAt(index);
    } else {
      throw new Error(
        'Method removeItem() failed. The \'rules\' control is either missing or not a FormArray.',
      );
    }
  }

  validateField(control: AbstractControl): boolean {
    const value = (control?.value as string) || '';
    return this.fields.some((field) => field.name === value);
  }
  
  trackByFn(index: number): number {
    return index; // or item.id if your items have unique ids
  }

  private subscribeToForm(): void {
    this.formValueSubs = this.form.valueChanges.subscribe(() => {
      this.valid = this.form.valid;
      this.invalid = this.form.invalid;
      this.emitChanges();
    });
  }

  private initialize(): void {
    if (this.data && this.expService.validate(this.data)) {
      console.log('Valid expression.');
      this.form = this.expService.toFormGroup(this.data);
    } else {
      console.log('Unable to validate expression.');
      this.form = this.fb.group({
        operator: [LogicalOperator.And],
        rules: this.fb.array([]),
      });
    }
  }

  private getRulesFormArray(host: FormGroup): FormArray {
    const rules = host.get('rules');
    if (!rules || !(rules instanceof FormArray)) {
      throw new Error('Form control \'rules\' is not a FormArray.');
    }
    return rules;
  }
}
