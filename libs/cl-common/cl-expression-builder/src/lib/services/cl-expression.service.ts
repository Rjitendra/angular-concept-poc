import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ValidatorFn, Validators, AbstractControl } from '@angular/forms';

import { ConditionLabels } from '../constants/labels';
import {
  KeyValueCollection,
  OptionValue,
  FieldTypeOperators,
  Field,
  FieldType,
  ConditionOperator,
  QueryExpression,
  ConditionExpression,
  LogicalOperator
} from '../interfaces/cl-express-builder.inteface';
type ConditionLabelsType = typeof ConditionLabels;

@Injectable()
export class ClExpressionService {
  private _typeOperators: KeyValueCollection<OptionValue[]> =
    new KeyValueCollection<OptionValue[]>();
  private _types!: KeyValueCollection<FieldTypeOperators>;
  private _fields!: KeyValueCollection<Field>;
  private _labels!: KeyValueCollection<string>;

  constructor(private fb: FormBuilder) {}
  get fields(): KeyValueCollection<Field> {
    return this._fields;
  }

  get labels(): KeyValueCollection<string> {
    if (this._labels) {
      return this._labels;
    }

    this.initLabels();
    return this._labels;
  }

  get types(): KeyValueCollection<FieldTypeOperators> {
    if (this._types) {
      return this._types;
    }

    this.initTypes();
    return this._types;
  }

  fieldByLabel(fieldLabel: string): Field | null {
    if (!this._fields || !fieldLabel) {
      return null;
    }

    //let item: Field = null;
    const items = this._fields.getItems();
    const filteredItems = items.filter(
      (item) => item.value.label.toLowerCase() === fieldLabel.toLowerCase(),
    );

    if (filteredItems.length > 0) {
      return filteredItems[0].value;
    }

    return null;
  }

  fieldLabel(fieldName: string): string {
    if (this._fields) {
      const options = this.fieldOptions(fieldName);

      if (options) {
        return options.label;
      }
    }

    return '';
  }

  fieldOptions(fieldName: string): Field | null {
    if (this._fields) {
      return this._fields.value(fieldName);
    }

    return null;
  }

  operatorsByType(type: FieldType): OptionValue[] {
    if (this._typeOperators.hasKey(type)) {
      return this._typeOperators.value(type);
    }

    const values: OptionValue[] = [];
    const typeInfo = this.types.value(type);

    if (typeInfo) {
      typeInfo.operators.forEach((item) => {
        values.push({
          value: item,
          label: ConditionLabels[item],
        });
      });

      this._typeOperators.add(type, values);
    }

    return values;
  }

  optionSetOperators(): OptionValue[] {
    const values: OptionValue[] = [
      {
        value: ConditionOperator.Equals,
        label: ConditionLabels[ConditionOperator.Equals],
      },
      {
        value: ConditionOperator.NotEquals,
        label: ConditionLabels[ConditionOperator.NotEquals],
      },
      {
        value: ConditionOperator.Contains,
        label: ConditionLabels[ConditionOperator.Contains],
      },
      {
        value: ConditionOperator.Null,
        label: ConditionLabels[ConditionOperator.Null],
      },
      {
        value: ConditionOperator.NotNull,
        label: ConditionLabels[ConditionOperator.NotNull],
      },
    ];

    return values;
  }

  setFields(fields: Field[]): void {
    this._fields = new KeyValueCollection<Field>();

    if (fields) {
      fields.forEach((field) => {
        this._fields.add(field.name, field);
      });
    }
  }

  toFormGroup(expression: QueryExpression): FormGroup {
    if (!expression) {
      return new FormGroup({});
    }

    const group: FormGroup = this.createGroup(expression.operator);
    const rules = group.get('rules') as FormArray;

    for (let i = 0; i < expression.rules.length; i++) {
      const item = expression.rules[i];

      if (this.isCondition(item)) {
        const c = item as ConditionExpression;
        rules.push(
          this.createCondition(
            c.fieldName,
            c.condition,
            c.value as string | number | Date | boolean,
          ),
        );
      } else if (this.isGroup(item)) {
        const g = item as QueryExpression;
        rules.push(this.toFormGroup(g));
      }
    }

    return group;
  }

  typeOptions(type: FieldType): FieldTypeOperators {
    return this.types.value(type);
  }

  validate(expression: QueryExpression): boolean {
    if (!expression) {
      return false;
    }

    if (!expression.operator) {
      return false;
    }

    if (!expression.rules) {
      return false;
    }

    for (let i = 0; i < expression.rules.length; i++) {
      const item = expression.rules[i];

      if (this.isCondition(item)) {
        const c = item as ConditionExpression;
        if (!c.fieldName || !c.condition) {
          return false;
        }
      } else if (this.isGroup(item)) {
        const g = item as QueryExpression;
        if (!g.operator || !g.rules) {
          return false;
        }
        this.validate(g);
      } else {
        return false;
      }
    }

    return true;
  }

  validadorsByType(type: FieldType): ValidatorFn[] {
    const fieldType = this.types.value(type);
    let validators: ValidatorFn[] = [];

    if (fieldType) {
      validators = fieldType.validators ?? [];

      if (validators && validators.length === 0) {
        validators = [];
      }
    }

    return validators;
  }

  createGroup(operator: LogicalOperator): FormGroup {
    return this.fb.group({
      operator: [operator],
      rules: this.fb.array([]),
    });
  }

  createCondition(
    fieldName?: string,
    condition?: ConditionOperator,
    value?: string | number | Date | boolean,
  ): FormGroup {
    const requiredValidator = Validators.required.bind(this); // Bind this
    return this.fb.group({
      fieldName: [fieldName, [requiredValidator, this.validateField]],
      condition: [{ value: condition, disabled: true }, [requiredValidator]],
      value: [value, [requiredValidator]],
    });
  }

  isCondition(value: ConditionExpression | QueryExpression): boolean {
    if (!value) {
      return false;
    }

    const item = value as ConditionExpression;
    return (
      Object.prototype.hasOwnProperty.call(item, 'fieldName') &&
      Object.prototype.hasOwnProperty.call(item, 'condition')
    );
  }

  isGroup(value: ConditionExpression | QueryExpression): boolean {
    if (!value) {
      return false;
    }

    const item = value as QueryExpression;
    return 'operator' in item && 'rules' in item;
  }

  validateField: ValidatorFn = (control: AbstractControl) => {
    const value = (control.value as string) || '';
    const result = this.fields?.value(value);

    return result ? null : { invalidField: true }; // Return error object if field is not valid
  };

  private initLabels(): void {
    this._labels = new KeyValueCollection<string>();
  
    for (const prop in ConditionLabels) {
      if (Object.prototype.hasOwnProperty.call(ConditionLabels, prop)) {
        const element = ConditionLabels[prop as keyof ConditionLabelsType];
        this._labels.add(prop, element);
      }
    }
  }
  

  private initTypes(): void {
    this._types = new KeyValueCollection<FieldTypeOperators>();
    const requiredValidator = Validators.required.bind(this); 

    this._types.add(FieldType.Boolean, {
      type: FieldType.Boolean,
      operators: [
        ConditionOperator.Equals,
        ConditionOperator.NotEquals,
        ConditionOperator.Null,
        ConditionOperator.NotNull,
      ],
      validators: [
        requiredValidator,
        Validators.pattern('^(true|false|1|0)$'),
      ],
    });

    this._types.add(FieldType.Date, {
      type: FieldType.Date,
      operators: [
        ConditionOperator.Equals,
        ConditionOperator.GreaterEqual,
        ConditionOperator.GreaterThan,
        ConditionOperator.LessEqual,
        ConditionOperator.LessThan,
        ConditionOperator.NotEquals,
        ConditionOperator.Null,
        ConditionOperator.NotNull,
      ],
      validators: [requiredValidator],
    });

    this._types.add(FieldType.Lookup, {
      type: FieldType.Lookup,
      operators: [
        ConditionOperator.Equals,
        ConditionOperator.NotEquals,
        ConditionOperator.Null,
        ConditionOperator.NotNull,
      ],
      validators: [requiredValidator],
    });

    this._types.add(FieldType.Number, {
      type: FieldType.Date,
      operators: [
        ConditionOperator.Equals,
        ConditionOperator.GreaterEqual,
        ConditionOperator.GreaterThan,
        ConditionOperator.LessEqual,
        ConditionOperator.LessThan,
        ConditionOperator.NotEquals,
        ConditionOperator.Null,
        ConditionOperator.NotNull,
      ],
      validators: [
        requiredValidator,
        Validators.pattern('^((-?)([0-9]*)|(-?)(([0-9]*).([0-9]*)))$'),
      ],
    });

    this._types.add(FieldType.Text, {
      type: FieldType.Date,
      operators: [
        ConditionOperator.Contains,
        ConditionOperator.Equals,
        ConditionOperator.NotEquals,
        ConditionOperator.Null,
        ConditionOperator.NotNull,
      ],
      validators: [requiredValidator],
    });
  }
}
