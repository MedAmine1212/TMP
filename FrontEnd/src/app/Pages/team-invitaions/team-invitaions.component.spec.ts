import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInvitaionsComponent } from './team-invitaions.component';

describe('TeamInvitaionsComponent', () => {
  let component: TeamInvitaionsComponent;
  let fixture: ComponentFixture<TeamInvitaionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamInvitaionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInvitaionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
