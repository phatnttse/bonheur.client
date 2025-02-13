import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsHitchedComponent } from './reviews-hitched.component';

describe('ReviewsHitchedComponent', () => {
  let component: ReviewsHitchedComponent;
  let fixture: ComponentFixture<ReviewsHitchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsHitchedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsHitchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
