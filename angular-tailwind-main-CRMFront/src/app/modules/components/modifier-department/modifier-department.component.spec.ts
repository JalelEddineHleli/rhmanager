import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierDepartmentComponent } from './modifier-department.component';

describe('ModifierDepartmentComponent', () => {
  let component: ModifierDepartmentComponent;
  let fixture: ComponentFixture<ModifierDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
