import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPresenceComponent } from './daily-presence.component';

describe('DailyPresenceComponent', () => {
  let component: DailyPresenceComponent;
  let fixture: ComponentFixture<DailyPresenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPresenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
