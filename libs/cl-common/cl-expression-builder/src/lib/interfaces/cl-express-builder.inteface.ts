import { Type } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export interface Person {
  UserName: string;
  FirstName: string;
  LastName: string;
  MiddleName: string | null;
  Gender: string;
  Age?: number | null;
  Emails: string[];
  FavoriteFeature: string;
  Features: string[];
  AddressInfo: AddressInfo[];
  HomeAddress: HomeAddress | null;
}
interface AddressInfo {
  Address: string;
  City: {
    Name: string;
    CountryRegion: string;
    Region: string;
  };
}

interface HomeAddress {
  Address: string | null;
  City: string | null;
}
// Define an interface for the validation error
export interface LookupValidatorError {
  LookupInvalidOption: { value: string | Record<string, string | number> };
}

export enum FieldType {
  Boolean = 'bool',
  Date = 'date',
  Lookup = 'lookup',
  Number = 'number',
  Text = 'text',
}

export enum ConditionOperator {
  Equals = 'eq',
  NotEquals = 'ne',
  GreaterThan = 'gt',
  GreaterEqual = 'ge',
  LessThan = 'lt',
  LessEqual = 'le',
  Contains = 'contains',
  Null = 'null',
  NotNull = 'notnull',
}

export interface ExpressionChangeEvent {
  valid: boolean;
  expression: QueryExpression;
}

export enum LogicalOperator {
  And = 'and',
  Or = 'or',
}

export interface Field {
  label: string;
  name: string;
  type: FieldType;
  values?: OptionValue[];
  lookup?: LookupSettings;
}

export interface LookupSettings {
  valueField: string;
  textField: string;
  service: Type<LookupService>;
}

export interface LookupService {
  data: Observable<Person[]>;
  loading: boolean;

  error?: (err: Error) => void;
  search: (value: string) => void;
}

export interface FieldTypeOperators {
  type: FieldType | string;
  operators: ConditionOperator[];
  validators?: ValidatorFn[]; // for internal use
}

export interface ConditionExpression {
  fieldName: string;
  condition: ConditionOperator;
  value: string | number | boolean | null;
}

export interface QueryExpression {
  operator: LogicalOperator;
  rules: (ConditionExpression | QueryExpression)[];
}

export interface OptionValue {
  value: string | number | boolean;
  label: string;
}

export interface KeyValuePair<T> {
  key: string;
  value: T;
}

export class KeyValueCollection<T> {
  private items: KeyValuePair<T>[] = [];
  private map: Record<string, T> = {};

  add(key: string, value: T): void {
    this.map[key] = value;
    this.items.push({ key: key, value: value });
  }

  addItem(item: KeyValuePair<T>): void {
    this.map[item.key] = item.value;
    this.items.push(item);
  }

  getItems(): KeyValuePair<T>[] {
    return this.items;
  }

  hasKey(key: string): boolean {
    return key in this.map; 
  }

  value(key: string): T {
    return this.map[key];
  }
}
