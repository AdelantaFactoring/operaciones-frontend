import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  @Input() data;

  public auditForm: FormGroup;
  private valueDefault: object = { value: '', disabled: true };

  constructor(private formBuilder: FormBuilder) {
    this.auditForm = formBuilder.group({
      usuarioCreacion: [this.valueDefault],
      fechaCreacion: [this.valueDefault],
      usuarioModificacion: [this.valueDefault],
      fechaModificacion: [this.valueDefault]
    });
  }

  ngOnInit(): void {
    this.auditForm.controls.usuarioCreacion.setValue(this.data.usuarioCreacion);
    this.auditForm.controls.fechaCreacion.setValue(this.data.fechaCreacion);
    this.auditForm.controls.usuarioModificacion.setValue(this.data.usuarioModificacion);
    this.auditForm.controls.fechaModificacion.setValue(this.data.fechaModificacion);
  }

}
