import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationsConfirmationDialogComponent } from './invitations-confirmation-dialog.component';

describe('InvitationsConfirmationDialogComponent', () => {
  let component: InvitationsConfirmationDialogComponent;
  let fixture: ComponentFixture<InvitationsConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationsConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationsConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
