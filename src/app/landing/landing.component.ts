import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service'
import { SignUpComponent } from '../sign-up/sign-up.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

  isMobile: Observable<BreakpointState>
  isDesktop: Observable<BreakpointState>

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,    
    public observer: BreakpointObserver
  ) { 
    this.isMobile = this.observer.observe('(max-width: 760px)')
    this.isDesktop = this.observer.observe('(min-width: 761px)')
  }

  openSignUpDialog() {
    this.dialog.open(SignUpComponent, {});
  }

  ngOnInit(): void {}

}