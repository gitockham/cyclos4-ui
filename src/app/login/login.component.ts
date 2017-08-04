import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { GeneralMessages } from "app/messages/general-messages";
import { LoginService } from "app/core/login.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LayoutService } from "app/core/layout.service";
import { LoginData } from "app/login/login-data";
import { LoginFormComponent } from "app/login/login-form.component";
import { DataForLogin, GroupForRegistration } from "app/api/models";

/**
 * Component used to show a login form.
 * Also has a link to public registration.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  @ViewChild("loginForm")
  public loginForm: LoginFormComponent;

  public dataForLogin: DataForLogin;
  public registrationGroups: GroupForRegistration[];

  public get canRegister(): boolean {
    return this.registrationGroups != null && this.registrationGroups.length > 0;
  }

  constructor(
    public layout: LayoutService,
    public generalMessages: GeneralMessages,
    private changeDetector: ChangeDetectorRef,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: {
      dataForLogin: DataForLogin,
      registrationGroups: GroupForRegistration[]
    }) => {
      this.dataForLogin = data.dataForLogin;
      this.registrationGroups = data.registrationGroups;
    });
  }

  /**
   * Performs the login
   */
  login(data: LoginData): void {
    // When using the external login button there's no data, so we assume it comes from the login form
    data = data || this.loginForm.data;
    this.loginService.login(data.principal, data.password)
      .then(u => {
        // Redirect to the correct URL
        this.router.navigateByUrl(this.loginService.redirectUrl || '');
      });
  }

}
