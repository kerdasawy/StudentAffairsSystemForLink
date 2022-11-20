import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Permission } from 'src/app/models/permission.model';
import { Role } from 'src/app/models/role.model';
import { ClassViewModel, StudentEditor } from 'src/app/models/StudentFormViewModel';
import { StudentListItemViewModel } from 'src/app/models/StudentListItemViewModel';
import { UserEdit } from 'src/app/models/user-edit.model';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { AlertService, MessageSeverity, DialogType } from 'src/app/services/alert.service';
import { AppTranslationService } from 'src/app/services/app-translation.service';
import { StudentServiceService } from 'src/app/services/student-service.service';
import { Utilities } from 'src/app/services/utilities';
import { UserInfoComponent } from '../../controls/user-info.component';
import { AddStudentComponent } from '../add-student/add-student.component';



@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, AfterViewInit {

  columns: any[] = [];
  rows: StudentListItemViewModel[] = [];
  rowsCache: StudentListItemViewModel[] = [];
  editedStudent: StudentEditor;
  sourceUser: StudentListItemViewModel;
  editingUserName: { name: string };
  loadingIndicator: boolean;
  classList: ClassViewModel[] = []
  allRoles: Role[] = [];


  public pageNumber: number = 1
  public pageSize = 10;
  public classNameFilter: string = null;
  public totoalCount = 30;

  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;

  @ViewChild('indexTemplate', { static: true })
  indexTemplate: TemplateRef<any>;

  @ViewChild('userNameTemplate', { static: true })
  userNameTemplate: TemplateRef<any>;

  @ViewChild('rolesTemplate', { static: true })
  rolesTemplate: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate: TemplateRef<any>;

  @ViewChild('editorModal', { static: true })
  editorModal: ModalDirective;

  @ViewChild('userEditor', { static: true })
  StudentEditor: AddStudentComponent;

  constructor(private alertService: AlertService,
    private studentService: StudentServiceService,
    private translationService: AppTranslationService, private accountService: AccountService, private cdRef: ChangeDetectorRef) {
  }


  ngOnInit() {

    const gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: 'index', name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
      { prop: 'name', name: 'Name', width: 50 },
      { prop: 'gender', name: 'Gender', width: 90 },
      { prop: 'class', name: 'Class', width: 120 },

    ];
    if (this.canManageUsers)
      this.columns.push({ name: '', width: 160, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });


    this.loadDataPage(this.pageNumber, this.pageSize, this.classNameFilter);
  }


  ngAfterViewInit() {

    this.StudentEditor.changesSavedCallback = () => {
      this.addNewUserToList();
      this.editorModal.hide();
    };

    this.StudentEditor.changesCancelledCallback = () => {
      this.editedStudent = null;
      this.sourceUser = null;
      this.editorModal.hide();
    };
  }


  addNewUserToList() {
    // if (this.sourceUser) {
    //   Object.assign(this.sourceUser, this.editedUser);

    //   let sourceIndex = this.rowsCache.indexOf(this.sourceUser, 0);
    //   if (sourceIndex > -1) {
    //     Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);
    //   }

    //   sourceIndex = this.rows.indexOf(this.sourceUser, 0);
    //   if (sourceIndex > -1) {
    //     Utilities.moveArrayItem(this.rows, sourceIndex, 0);
    //   }

    //   this.editedUser = null;
    //   this.sourceUser = null;
    // } else {
    //   const user = new User();
    //   Object.assign(user, this.editedUser);
    //   this.editedUser = null;

    //   let maxIndex = 0;
    //   for (const u of this.rowsCache) {
    //     if ((u as any).index > maxIndex) {
    //       maxIndex = (u as any).index;
    //     }
    //   }

    //   (user as any).index = maxIndex + 1;

    //   this.rowsCache.splice(0, 0, user);
    //   this.rows.splice(0, 0, user);
    //   this.rows = [...this.rows];
    // }
  }


  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    if (this.canViewRoles) {
      this.accountService.getUsersAndRoles().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));
    } else {
      this.accountService.getUsers().subscribe(users => this.onDataLoadSuccessful(users, this.accountService.currentUser.roles.map(x => new Role(x))), error => this.onDataLoadFailed(error));
    }
  }

  loadDataPage(pageNumber: number, pageSize: number, classname: string) {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.classNameFilter = classname;
    this.cdRef.detectChanges();
    var loadStudentSub = this.studentService.getStudentList(pageNumber, pageSize, classname).subscribe(

      res => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        res.items.forEach((student, index) => {
          (student as any).index = index + (this.pageNumber - 1) * this.pageSize + 1;
        });

        this.totoalCount = res.totalCount;
        this.rowsCache = [...res.items];
        this.rows = res.items;
      }
    )
  }
  onDataLoadSuccessful(users: User[], roles: Role[]) {
    // this.alertService.stopLoadingMessage();
    // this.loadingIndicator = false;

    // users.forEach((user, index) => {
    //   (user as any).index = index + 1;
    // });

    // this.rowsCache = [...users];
    // this.rows = users;

    // this.allRoles = roles;
  }


  onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }


  onSearchChanged(value: string) {
    this.classNameFilter = value;

    this.loadDataPage(1, this.pageSize, this.classNameFilter);
  }

  onEditorModalHidden() {
    this.editingUserName = null;
    this.StudentEditor.resetForm(true);
    this.loadDataPage(1,this.pageSize,this.classNameFilter)
  }


  newStudent() {
    this.editingUserName = null;
    this.sourceUser = null;
    this.StudentEditor.isEditMode = true;
    debugger;;
    if (this.classList.length == 0) {
      let classSub = this.studentService.getClassList().subscribe(res => {

        this.classList = res;
        this.editedStudent = new StudentEditor();
        this.editedStudent.classId = this.classList[0].id
        this.editedStudent.classList = this.classList;
        this.StudentEditor.student = this.editedStudent;
        debugger;;
        this.editorModal.show();
      });
    }
    else {

      this.editedStudent = new StudentEditor();
      this.editedStudent.classId = this.classList[0].id
      this.editedStudent.classList = this.classList;
      this.editorModal.show();
    }

  }


  editUser(row: UserEdit) {
    // this.editingUserName = { name: row.userName };
    // this.sourceUser = row;
    // this.editedUser = this.userEditor.editUser(row, this.allRoles);
    // this.editorModal.show();
  }


  deleteUser(row: StudentListItemViewModel) {
    this.alertService.showDialog('Are you sure you want to delete \"' + row.name + '\"?', DialogType.confirm, () => this.deleteUserHelper(row));
  }


  deleteUserHelper(row: StudentListItemViewModel) {

    this.alertService.startLoadingMessage('Deleting...');
    this.loadingIndicator = true;
    let seleteStudentsub = this.studentService.deleteStudent(row.id).subscribe(res => {

      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;

      this.rowsCache = this.rowsCache.filter(item => item.id !== row.id);
      this.rows = this.rows.filter(item => item.id !== row.id);
    },
      error => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the Student.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
          MessageSeverity.error, error);
      });


    // this.accountService.deleteUser(row)
    //   .subscribe(results => {
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;

    //     this.rowsCache = this.rowsCache.filter(item => item !== row);
    //     this.rows = this.rows.filter(item => item !== row);
    //   },
    //     error => {
    //       this.alertService.stopLoadingMessage();
    //       this.loadingIndicator = false;

    //       this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
    //         MessageSeverity.error, error);
    //     });
  }



  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canManageUsers() {
    return this.accountService.userHasPermission(Permission.manageUsersPermission);
  }

  public pageChanged(event: PageChangedEvent) {
    this.loadDataPage(event.page, event.itemsPerPage, this.classNameFilter)
  }
}
