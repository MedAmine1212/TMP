import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptInvitationTMPComponent } from './accept-invitation-tmp.component';

describe('AcceptInvitationTMPComponent', () => {
  let component: AcceptInvitationTMPComponent;
  let fixture: ComponentFixture<AcceptInvitationTMPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptInvitationTMPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptInvitationTMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
