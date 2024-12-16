import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Toast } from '../../models/toast.model';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toastr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toastr.component.html',
  styleUrl: './toastr.component.scss',
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('300ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateY(100%)', opacity:0}))
      ])
    ])
  ]
})
export class ToastrComponent implements OnInit, OnDestroy{
    private toasterService = inject(NotificationService);

    toasts: Toast[] = [];
    private subscription!: Subscription;

    ngOnInit(): void{
      this.subscription = this.toasterService.toasts$.subscribe(toasts => this.toasts = toasts);
    }

    ngOnDestroy(): void{
      if(this.subscription){
        this.subscription.unsubscribe()
      }
    }
    
    removeToast(id: number){
      this.toasterService.remove(id);
    }
}
