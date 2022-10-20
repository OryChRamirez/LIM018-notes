import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingUpComponent } from './view-sing-up.component';

describe('ViewSingUpComponent', () => {
  let component: ViewSingUpComponent;
  let fixture: ComponentFixture<ViewSingUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSingUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSingUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
