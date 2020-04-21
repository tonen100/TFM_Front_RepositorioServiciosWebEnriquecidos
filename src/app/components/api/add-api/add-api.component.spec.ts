import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAPIComponent } from './add-api.component';

describe('AddAPIComponent', () => {
  let component: AddAPIComponent;
  let fixture: ComponentFixture<AddAPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAPIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
