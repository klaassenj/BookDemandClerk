import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadbooksPage } from './uploadbooks.page';

describe('UploadbooksPage', () => {
  let component: UploadbooksPage;
  let fixture: ComponentFixture<UploadbooksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadbooksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadbooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
