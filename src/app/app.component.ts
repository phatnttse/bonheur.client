import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { StatusService } from './services/status.service';
import AOS from 'aos';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Bonheur';
  isLoading: boolean = false; // Indicates whether the application is loading data

  constructor(public statusService: StatusService) {
    this.statusService.statusLoadingSpinner$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }

  ngOnInit() {
    AOS.init();
  }
}
