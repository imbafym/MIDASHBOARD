import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedItemComponent } from './deleted-item.component';

describe('DeletedItemComponent', () => {
  let component: DeletedItemComponent;
  let fixture: ComponentFixture<DeletedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
