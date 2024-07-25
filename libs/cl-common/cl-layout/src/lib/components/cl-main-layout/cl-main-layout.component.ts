import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'; // Import Angular Material toolbar module
import { MatCardModule } from '@angular/material/card'; // Import Angular Material card module
import { MatSidenavModule } from '@angular/material/sidenav'; // Import Angular Material sidenav module
import { MatListModule } from '@angular/material/list'; // Import Angular Material list module
import { MatIconModule } from '@angular/material/icon'; // Import Angular Material icon module
import { MatButtonModule } from '@angular/material/button'; // Import Angular Material button module
import { MatMenuModule } from '@angular/material/menu'; // Import Angular Material button module
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cl-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule
  ],
  templateUrl: './cl-main-layout.component.html',
  styleUrl: './cl-main-layout.component.scss'
})
export class ClMainLayoutComponent {
  currentYear: number = new Date().getFullYear();
  isExpanded: boolean = true;

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }
}
