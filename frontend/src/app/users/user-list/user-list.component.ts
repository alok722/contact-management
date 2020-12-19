import { Component, OnInit, TemplateRef  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../../user.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  modalRef: BsModalRef;

  user: User = new User();
  users: any;
  editUser: any;
  errorMsg: ErrorMsg = new ErrorMsg();
  id = {'id': ''};

  constructor(private modalService: BsModalService, private userService: UserService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.get().subscribe(res => {
      this.users =  res;
    }, error => {
      console.error(error);
    });
  }

  onSave() {
    this.errorMsg.name = this.errorMsg.mobile = '';
    !this.user.name ? this.errorMsg.name = 'Name Required' : '';
    !this.user.mobile ? this.errorMsg.mobile = 'Mobile Number Required' : '';
    if (!this.user.name || !this.user.mobile) {
      return;
    }

    this.userService.post(this.user).subscribe(res => {
      this.getUser();
      this.modalRef.hide();
      this.user.name = '';
      this.user.mobile = '';
    }, error => {
      console.error(error);
    });
  }

  onUpdate() {
    this.userService.update(this.editUser).subscribe(res => {
      this.getUser();
      this.modalRef.hide();
    }, error => {
      console.error(error);
    });
  }

  onDelete() {
    this.userService.delete(this.id).subscribe(res => {
      this.getUser();
      this.modalRef.hide();
    }, error => {
      console.error(error);
    });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { animated: true, backdrop: 'static' });
  }
  openModalEdit(template: TemplateRef<any>, user) {
    this.modalRef = this.modalService.show(template, { animated: true, backdrop: 'static' });
    this.editUser = user;
  }

  openModalDelete(template: TemplateRef<any>, id) {
    this.id.id = id;
    this.modalRef = this.modalService.show(template, { animated: true, backdrop: 'static' });
  }
}

class User {
  name: string;
  mobile: string;
}

class ErrorMsg {
  name: string;
  mobile: string;
}
