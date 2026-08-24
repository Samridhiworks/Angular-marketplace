import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs';

import { Api } from '../../../services/api';

@Component({
  selector: 'app-manage-permission',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogClose
],
  templateUrl: './manage-permission.html',
  styleUrl: './manage-permission.css',
})
export class ManagePermission implements OnInit {
  roleId!: string;
  roleName!: string;

  loadingRolePermissions = false;
  loadingAllPermissions = false;

  saving = false;

  assignedPermissions: any[] = [];

  selectedPermissionIds: string[] = [];

  permissionModules: any[] = [];

  constructor(
    private api: Api,
    private dialogRef: MatDialogRef<ManagePermission>,
    private cdr: ChangeDetectorRef,

    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {
    this.roleId = String(data.roleId);
    this.roleName = data.roleName;

    console.log('Dialog data:', data);
    console.log('Role ID:', this.roleId);
    console.log('Role Name:', this.roleName);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getRolePermissions();
      this.getAllPermissions();
    });
  }

  getRolePermissions(): void {
    this.loadingRolePermissions = true;

    console.log('GET:', `/roles/${this.roleId}/permissions`);

    this.api
      .get(`/roles/${this.roleId}/permissions`)
      .pipe(
        finalize(() => {
          this.loadingRolePermissions = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          console.log('ROLE PERMISSIONS RESPONSE:', res);

          /*
            Tumhara response:

            {
              data: [
                {
                  id: "129",
                  roleId: "12",
                  permissionId: "29",
                  permission: {
                    id: "29",
                    name: "View Earnings",
                    module: "DELIVERY_AGENT"
                  }
                }
              ]
            }
          */

          const data = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : [];

          this.assignedPermissions = data;

          this.selectedPermissionIds = data.map((item: any) =>
            String(item.permissionId),
          );

          const assignedPermissionDetails = data
            .map((item: any) => item.permission)
            .filter(Boolean);

          if (assignedPermissionDetails.length > 0) {
            this.permissionModules = this.groupPermissionsByModule(
              assignedPermissionDetails,
            );
          }

          console.log('ASSIGNED PERMISSION IDS:', this.selectedPermissionIds);

          this.cdr.detectChanges();
        },

        error: (error: any) => {
          console.error('ROLE PERMISSIONS ERROR:', error);

          this.cdr.detectChanges();
        },
      });
  }

  getAllPermissions(): void {
    this.loadingAllPermissions = true;

    console.log('GET:', '/permissions');

    this.api

      .get('/permissions')
      .pipe(
        finalize(() => {
          this.loadingAllPermissions = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          console.log('ALL PERMISSIONS RESPONSE:', res);

          const permissions = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : [];

          this.permissionModules = this.groupPermissionsByModule(permissions);

          console.log('PERMISSION MODULES:', this.permissionModules);

          this.cdr.detectChanges();
        },

        error: (error: any) => {
          console.error('ALL PERMISSIONS ERROR:', error);

          this.cdr.detectChanges();
        },
      });
  }

  private groupPermissionsByModule(permissions: any[]): any[] {
    const groupedPermissions = new Map<string, any[]>();

    permissions.forEach((permission: any) => {
      const module = permission.module || 'OTHER';
      const currentPermissions = groupedPermissions.get(module) || [];
      currentPermissions.push(permission);
      groupedPermissions.set(module, currentPermissions);
    });

    return Array.from(groupedPermissions, ([module, modulePermissions]) => ({
      module,
      permissions: modulePermissions,
    }));
  }

  togglePermission(permissionId: string, checked: boolean): void {
    permissionId = String(permissionId);

    if (checked) {
      if (!this.selectedPermissionIds.includes(permissionId)) {
        this.selectedPermissionIds.push(permissionId);
      }
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(
        (id) => id !== permissionId,
      );
    }

    console.log('SELECTED PERMISSIONS:', this.selectedPermissionIds);
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissionIds.includes(String(permissionId));
  }

  savePermissions(): void {
    this.saving = true;

    const body = {
      permissionIds: this.selectedPermissionIds,
    };

    console.log('POST URL:', `/roles/${this.roleId}/permissions`);

    console.log('POST BODY:', body);

    this.api.post(`/roles/${this.roleId}/permissions`, body).subscribe({
      next: (res: any) => {
        console.log('PERMISSIONS SAVED:', res);

        this.saving = false;
        this.cdr.detectChanges();
        this.dialogRef.close(true);
      },

      error: (error: any) => {
        console.error('SAVE PERMISSIONS ERROR:', error);
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }
}
