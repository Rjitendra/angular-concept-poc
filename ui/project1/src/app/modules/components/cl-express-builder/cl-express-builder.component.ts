import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Field,
  QueryExpression,
  ExpressionChangeEvent,
  ClExpressionBuilderComponent,
} from '../../../../../../../libs/cl-common/cl-expression-builder/src/public-api';
import { sampleFields, sampleData } from './sample-data';
import { SampleRemoteService } from './sample.remote.service';

@Component({
  selector: 'app-cl-express-builder',
  standalone: true,
  imports: [CommonModule, ClExpressionBuilderComponent],
  providers: [SampleRemoteService],
  templateUrl: './cl-express-builder.component.html',
  styleUrl: './cl-express-builder.component.scss',
})
export class ClExpressBuilderComponent {
  fields: Field[] = sampleFields;
  data!: QueryExpression;

  valid!: boolean;
  expression!: QueryExpression;

  feed(): void {
    this.data = sampleData as QueryExpression;
  }

  change(e: ExpressionChangeEvent) {
    this.valid = e.valid;
    this.expression = e.expression;
  }
}
