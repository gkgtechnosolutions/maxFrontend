import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTextModalComponent } from './image-text-modal.component';

describe('ImageTextModalComponent', () => {
  let component: ImageTextModalComponent;
  let fixture: ComponentFixture<ImageTextModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageTextModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageTextModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
