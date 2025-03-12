import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding flex flex-wrap items-center justify-center ">
      <a [routerLink]="['/']">
        <img
          src="/assets/images/logos/logo.png"
          class="align-middle m-2 w-12 h-12"
          alt="logo"
        />
      </a>
      <p class="font-semibold ml-2">Bonheur Admin</p>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
