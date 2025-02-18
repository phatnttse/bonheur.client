import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { SupplierService } from '../../../../services/supplier.service';
import { DataService } from '../../../../services/data.service';
import { BaseResponse } from '../../../../models/base.model';
import {
  SupplierFAQ,
  SupplierFAQRequest,
} from '../../../../models/supplier.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFaqComponent } from '../../../dialogs/supplier/storefront/delete-faq/delete-faq.component';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FaqsComponent implements OnInit {
  faqForm: FormGroup;
  faqs: SupplierFAQ[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private supplierService: SupplierService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
    this.faqForm = this.formBuilder.group({
      faqs: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.dataService.faqDataSource.subscribe((data: SupplierFAQ[] | null) => {
      if (data?.values) {
        this.faqs = data;
        this.populateFaqForm();
      } else {
        this.getSupplierFAQs();
      }
    });
  }

  getSupplierFAQs() {
    this.supplierService.getSupplierFAQs().subscribe({
      next: (response: BaseResponse<SupplierFAQ[]>) => {
        this.faqs = response.data;
        this.dataService.faqDataSource.next(this.faqs);
        this.populateFaqForm();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  faqsFormArray(): FormArray {
    return this.faqForm.get('faqs') as FormArray;
  }

  populateFaqForm() {
    const faqsArray = this.faqsFormArray();
    faqsArray.clear();
    if (this.faqs.length === 0) {
      this.addNewFaqControl();
    } else {
      this.faqs.forEach((faq) => {
        faqsArray.push(
          this.formBuilder.group({
            id: new FormControl(faq.id),
            question: new FormControl(faq.question),
            answer: new FormControl(faq.answer),
          })
        );
      });
    }
  }

  addNewFaqControl() {
    this.faqsFormArray().push(
      this.formBuilder.group({
        id: new FormControl(''),
        question: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
        ]),
        answer: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
        ]),
      })
    );
  }

  insertUpdateSupplierFaqs() {
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      this.notificationService.warning('Warning', 'Please fill in all fields');
      return;
    }
    this.statusService.statusLoadingSpinnerSource.next(true);
    const faqsArray = this.faqsFormArray();
    const newFaqs: SupplierFAQRequest[] = [];
    const updatedFaqs: SupplierFAQRequest[] = [];
    let isSaved = false;

    faqsArray.controls.forEach((control) => {
      const faq = control.value as SupplierFAQRequest;
      if (faq.id) {
        updatedFaqs.push(faq);
      } else {
        newFaqs.push({
          question: control.get('question')?.value,
          answer: control.get('answer')?.value,
        });
      }
    });

    // Gọi API nếu có dữ liệu mới cần gửi
    if (newFaqs.length > 0) {
      this.supplierService.createSupplierFAQs(newFaqs).subscribe({
        next: (response: BaseResponse<SupplierFAQ[]>) => {
          this.faqs.push(...response.data);
          this.dataService.faqDataSource.next(this.faqs);
          this.populateFaqForm();
          isSaved = true;
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
          return;
        },
      });
    }

    if (updatedFaqs.length > 0) {
      this.supplierService.updateSupplierFAQs(updatedFaqs).subscribe({
        next: (response: BaseResponse<SupplierFAQ[]>) => {
          this.faqs = this.faqs.map((faq) => {
            const updatedFaq = response.data.find(
              (updatedFaq) => updatedFaq.id === faq.id
            );
            return updatedFaq || faq;
          });
          this.dataService.faqDataSource.next(this.faqs);
          this.populateFaqForm();
          isSaved = true;
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
          return;
        },
      });
    }

    if (newFaqs.length === 0 && updatedFaqs.length === 0) {
      return;
    }
    this.statusService.statusLoadingSpinnerSource.next(false);
    this.notificationService.success('Success', 'Saved successfully');
  }

  removeFaqControl(_t32: number) {
    const faqsArray = this.faqsFormArray();
    faqsArray.removeAt(_t32);
  }

  openRemoveFaqDialog(_t32: number) {
    const faqsArray = this.faqsFormArray();
    const faq = faqsArray.controls[_t32].value;
    if (faq.id) {
      const dialogRef = this.dialog.open(DeleteFaqComponent, {
        data: faq.id,
      });
      dialogRef.afterClosed().subscribe((result: SupplierFAQ) => {
        if (result) {
          faqsArray.removeAt(_t32);
          this.faqs = this.faqs.filter((faq) => faq.id !== result.id);
          this.dataService.faqDataSource.next(this.faqs);
          this.populateFaqForm();
        }
      });
    }
  }
}
