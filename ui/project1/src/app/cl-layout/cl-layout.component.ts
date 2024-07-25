import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClMainLayoutComponent } from '../../../../../libs/cl-common/cl-layout/src/public-api';



@Component({
  selector: 'app-cl-layout',
  standalone: true,
  imports: [RouterOutlet,ClMainLayoutComponent],
  templateUrl: './cl-layout.component.html',
  styleUrl: './cl-layout.component.scss'
})
export class ClLayoutComponent {

}
