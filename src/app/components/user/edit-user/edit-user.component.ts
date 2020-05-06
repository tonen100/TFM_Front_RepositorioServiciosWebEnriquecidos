import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models/user';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ImgStorageService } from 'src/app/services/img-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as clone from 'clone';
import { Ng2ImgMaxService } from 'ng2-img-max';

const snakeCase = (str) => {
  return str.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word: string) => word.toLowerCase())
    .join('_');
};

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent extends TranslatableComponent implements OnInit, AfterViewInit {

  faUserCircle = faUserCircle;

  currentUser: User;
  activeRole: string;
  editUserForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  logo: any;

  constructor(
    public translateService: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private imgStorageService: ImgStorageService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private imgMaxService: Ng2ImgMaxService
    ) {
    super(translateService);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.currentUser = this.authService.getCurrentUser();
        console.log(this.currentUser)
        if (this.currentUser && this.authService.getIdToken()) {
          if (this.currentUser._id === params.id) {
            this.activeRole = this.currentUser.role.toString();
            this.createForm();
            this.editUserForm.patchValue({
              name: this.currentUser.username,
              description: this.currentUser.description,
              logoURL: this.currentUser.logoUrl
            });
            this.onLoadLogoURL();
          } else {
            this.router.navigate(['404']);
            this.toastr.error('auth.forbidden');
          }
        } else {
          this.router.navigate(['login']);
        }
      }
    );
  }

  ngAfterViewInit() {
    this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
  }

  createForm() {
    this.editUserForm = this.fb.group({
        name: ['', Validators.required],
        logoURL: [''],
        description: [''],
        validated: ['true']
      });
  }

  showError(message: string) {
    this.hideError();
    this.errorMessage = message;
    this.errorAlert.style.display = 'block';
    this.errorAlert.classList.add('show');
  }

  hideError() {
    this.errorMessage = null;
    this.errorAlert.style.display = 'none';
    this.errorAlert.classList.remove('show');
  }

  onLoadLogoURL() {
    if (this.editUserForm.value.logoURL != null && this.editUserForm.value.logoURL !== '') {
      this.logo = null;
    }
  }

  onLoadLogoFile() {
    this.imgMaxService.compressImage((document.getElementById('logo') as HTMLInputElement).files[0], 0.1).subscribe(img => {
      if (img != null) {
        const imageUrl = URL.createObjectURL(img);
        this.logo = img;
        setTimeout(() => (document.getElementById('imageLogo') as HTMLImageElement).src = imageUrl, 500);
      }
    }, err => this.showError(this.translateService.instant('api.errors.unprocessable_file')));
  }

  async storeLogo() {
    const blobImg = this.logo;
    await this.imgStorageService.uploadImage(
      blobImg,
      'User',
      snakeCase(this.editUserForm.value.name) + (
        blobImg.name.lastIndexOf('.') != null ? blobImg.name.slice(blobImg.name.lastIndexOf('.')) : ''
      )
    ).then((downloadURL) => {
      this.editUserForm.patchValue({ logoURL: downloadURL });
    });
  }

  goToUser() {
    this.router.navigate(['user', this.currentUser._id]);
  }

  editUser() {
    let values = this.editUserForm.value;
    const user = clone<User>(this.currentUser);
    user.username = values.name;
    user.logoUrl = values.logoURL;
    user.description = values.description;
    this.userService.updateProfile(user, this.authService.getIdToken()).then(newUser => {
      this.currentUser.username = newUser.username;
      this.currentUser.logoUrl = newUser.logoUrl;
      this.currentUser.description = newUser.description;
      this.goToUser();
    }).catch(_ => this.showError(this.translateService.instant('user.errors.fail_edit_user')));
  }

  onEditUser() {
    const values = this.editUserForm.value;
    this.userService.getUserByName(values.name).then(async users => {
      if (this.currentUser.username === values.name || users.length === 0) {
        if (this.logo != null) {
          await this.storeLogo().then(_ => this.editUser())
          .catch(_ => this.showError(this.translateService.instant('api.errors.load_logo_unexpected')));
        } else {
          this.editUser();
        }
      } else {
        this.showError(this.translateService.instant('user.errors.already_exist_name'));
      }
    });
  }
}
