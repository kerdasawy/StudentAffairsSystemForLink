import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Permission } from 'src/app/models/permission.model';
import { Role } from 'src/app/models/role.model';
import { StudentEditor, StudentFormViewModel } from 'src/app/models/StudentFormViewModel';
import { UserEdit } from 'src/app/models/user-edit.model';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity } from 'src/app/services/alert.service';
import { StudentServiceService } from 'src/app/services/student-service.service';
import { Utilities } from 'src/app/services/utilities';

 


@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit{

  public isEditMode = false;
  public isNewUser = false;
  public isSaving = false;
  public isChangePassword = false;
  public isEditingSelf = false;
  public showValidationErrors = false;
  public uniqueId: string = Utilities.uniqueId();
  
  public student: StudentEditor ;
  public userEdit: StudentEditor;
  public allRoles: Role[] = [];

  public formResetToggle = true;

  public changesSavedCallback: () => void;
  public changesFailedCallback: () => void;
  public changesCancelledCallback: () => void;

  @Input()
  isViewOnly: boolean;

  @Input()
  isGeneralEditor = false;





  @ViewChild('f')
  public form;

  // ViewChilds Required because ngIf hides template variables from global scope
  // @ViewChild('userName')
  // public userName;

  // @ViewChild('userPassword')
  // public userPassword;

  // @ViewChild('email')
  // public email;

  // @ViewChild('currentPassword')
  // public currentPassword;

  // @ViewChild('newPassword')
  // public newPassword;

  // @ViewChild('confirmPassword')
  // public confirmPassword;

  // @ViewChild('roles')
  // public roles;


  constructor(private alertService: AlertService, private accountService: AccountService, private studentService:StudentServiceService) {
    this.student = new StudentEditor();
  }

  ngOnInit() {
    
  }



   

  private onCurrentUserDataLoadSuccessful(user: User, roles: Role[]) {
    // this.alertService.stopLoadingMessage();
    // this.student = user;
    // this.allRoles = roles;
  }

  private onCurrentUserDataLoadFailed(error: any) {
    // this.alertService.stopLoadingMessage();
    // this.alertService.showStickyMessage('Load Error', `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
    //   MessageSeverity.error, error);

    // this.student = new User();
  }



  getRoleByName(name: string) {
    return this.allRoles.find((r) => r.name === name);
  }



  showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }


  deletePasswordFromUser(user: UserEdit | User) {
    const userEdit = user as UserEdit;

    delete userEdit.currentPassword;
    delete userEdit.newPassword;
    delete userEdit.confirmPassword;
  }


  edit() {
    if (!this.isGeneralEditor) {
      this.isEditingSelf = true;
      this.userEdit = new StudentEditor();
      Object.assign(this.userEdit, this.student);
    } else {
      if (!this.userEdit) {
        this.userEdit = new StudentEditor();
      }

      this.isEditingSelf = this.accountService.currentUser ? this.userEdit.id === this.accountService.currentUser.id : false;
    }

    this.isEditMode = true;
    this.showValidationErrors = true;
    this.isChangePassword = false;
  }


  save() {
    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');
 
    var saveSub= this.studentService.postNewStudent(this.student).subscribe(res =>{
      this.isSaving = false;
      this.alertService.stopLoadingMessage();
 
    this.isChangePassword = false;
    this.showValidationErrors = true; 
    let classlist =  this.student.classList
    Object.assign(this.student, this.userEdit);
    this.userEdit = new StudentEditor();
    this.userEdit.classList = classlist;
   
    this.resetForm();
    });
    
    // if (this.isNewUser) {
    //   this.accountService.newUser(this.userEdit).subscribe(user => this.saveSuccessHelper(user), error => this.saveFailedHelper(error));
    // } else {
    //   this.accountService.updateUser(this.userEdit).subscribe(response => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
    // }
  }


  private saveSuccessHelper(user?: User) {
    // this.testIsRoleUserCountChanged(this.student, this.userEdit);

    // if (user) {
    //   Object.assign(this.userEdit, user);
    // }

    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.isChangePassword = false;
    this.showValidationErrors = false;

    // this.deletePasswordFromUser(this.userEdit);
    Object.assign(this.student, this.userEdit);
    this.userEdit = new StudentEditor();
    this.resetForm();


    if (this.isGeneralEditor) {
      // if (this.isNewUser) {
      //   this.alertService.showMessage('Success', `User \"${this.student.userName}\" was created successfully`, MessageSeverity.success);
      // } else if (!this.isEditingSelf) {
      //   this.alertService.showMessage('Success', `Changes to user \"${this.student.userName}\" was saved successfully`, MessageSeverity.success);
      // }
    }

    

    this.isEditMode = false;


    if (this.changesSavedCallback) {
      this.changesSavedCallback();
    }
  }


  private saveFailedHelper(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'The below errors occured whilst saving your changes:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);

    if (this.changesFailedCallback) {
      this.changesFailedCallback();
    }
  }



  private testIsRoleUserCountChanged(currentUser: User, editedUser: User) {

    const rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) === -1);
    const rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) === -1);

    const modifiedRoles = rolesAdded.concat(rolesRemoved);

    if (modifiedRoles.length) {
      setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
    }
  }



  cancel() {
    // if (this.isGeneralEditor) {
    //   this.userEdit = this.student = new UserEdit();
    // } else {
    //   this.userEdit = new UserEdit();
    // }

    this.showValidationErrors = false;
    this.resetForm();

    this.alertService.showMessage('Cancelled', 'Operation cancelled by user', MessageSeverity.default);
    this.alertService.resetStickyMessage();

    if (!this.isGeneralEditor) {
      this.isEditMode = false;
    }

    if (this.changesCancelledCallback) {
      this.changesCancelledCallback();
    }
  }


  close() {
    // this.userEdit = this.student = new UserEdit();
    this.showValidationErrors = false;
    this.resetForm();
    this.isEditMode = false;

    if (this.changesSavedCallback) {
      this.changesSavedCallback();
    }
  }



 


  changePassword() {
    this.isChangePassword = true;
  }


  unlockUser() {
    this.isSaving = true;
    this.alertService.startLoadingMessage('Unblocking user...');


    this.accountService.unblockUser(this.userEdit.id)
      .subscribe(() => {
        this.isSaving = false;
        // this.userEdit.isLockedOut = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage('Success', 'User has been successfully unblocked', MessageSeverity.success);
      },
        error => {
          this.isSaving = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Unblock Error', 'The below errors occured whilst unblocking the user:', MessageSeverity.error, error);
          this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        });
  }


  resetForm(replace = false) {
    this.isChangePassword = false;

    if (!replace) {
      this.form.reset();
    } else {
      this.formResetToggle = false;

      setTimeout(() => {
        this.formResetToggle = true;
      });
    }
  }


  newUser(allRoles: Role[]) {
    this.isGeneralEditor = true;
    this.isNewUser = true;

    this.allRoles = [...allRoles];
    // this.student = this.userEdit = new UserEdit();
    // this.userEdit.isEnabled = true;
    this.edit();

    return this.userEdit;
  }

  editUser(user: User, allRoles: Role[]) {
    if (user) {
      this.isGeneralEditor = true;
      this.isNewUser = false;

      this.setRoles(user, allRoles);
      // this.student = new User();
      this.userEdit = new StudentEditor();
      Object.assign(this.student, user);
      Object.assign(this.userEdit, user);
      this.edit();

      return this.userEdit;
    } else {
      return this.newUser(allRoles);
    }
  }


  displayUser(user: User, allRoles?: Role[]) {

    // this.student = new User();
    // Object.assign(this.student, user);
    // this.deletePasswordFromUser(this.student);
    this.setRoles(user, allRoles);

    this.isEditMode = false;
  }



  private setRoles(user: User, allRoles?: Role[]) {

    this.allRoles = allRoles ? [...allRoles] : [];

    if (user.roles) {
      for (const ur of user.roles) {
        if (!this.allRoles.some(r => r.name === ur)) {
          this.allRoles.unshift(new Role(ur));
        }
      }
    }
  }



  get canViewAllRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }
}

 

