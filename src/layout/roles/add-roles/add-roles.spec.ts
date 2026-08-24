import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoles } from './add-roles';

describe('AddRoles', () => {
  let component: AddRoles;
  let fixture: ComponentFixture<AddRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
