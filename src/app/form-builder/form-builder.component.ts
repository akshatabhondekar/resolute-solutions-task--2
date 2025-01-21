import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Control } from '../contstants/control.enum';
declare var bootstrap: any;
@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent implements AfterViewInit {
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  fieldLabel: string = '';
  fieldType: any;
  fieldPlaceholder: string = '';
  isRequired: boolean = false;
  minLength: number = 30;
  maxLength: number = 30;
  isCheckBoxOrRadio: boolean = false;
  options: any[] = [];
  submitted: boolean;
  isreadOnly: boolean;
  formOptions: any = {};
  editIndex: number;
  isEdit: boolean;
  constructor() {}

  get TextBox() {
    return Control.TEXTBOX;
  }
  get TextArea() {
    return Control.TEXTAREA;
  }
  get Radio() {
    return Control.RADIO;
  }
  get Checkbox() {
    return Control.CHECKBOX;
  }
  get Select() {
    return Control.SELECT;
  }
  get Date() {
    return Control.DATE;
  }

  deleteField(index: number) {
    // Remove the field at the provided index
    this.fields.splice(index, 1);
    localStorage.setItem('formFields', JSON.stringify(this.fields));
  }
  // Method to edit a field
  editField(index: number) {
    // Get the field to be edited
    const fieldToEdit = this.fields[index];
    debugger;
    this.isEdit = true;
    this.fieldLabel = fieldToEdit.props.label;
    switch (fieldToEdit.type) {
      case 'input':
        this.fieldType = Control.TEXTBOX;
        break;
      case 'textarea':
        this.fieldType = Control.TEXTAREA;
        break;
      case 'radio':
        this.isCheckBoxOrRadio = true;

        this.fieldType = Control.RADIO;
        break;
      case 'checkboxs':
        this.isCheckBoxOrRadio = true;
        this.fieldType = Control.CHECKBOX;
        break;
      case 'select':
        this.isCheckBoxOrRadio = true;
        this.fieldType = Control.SELECT;
        break;
      case 'date':
        this.fieldType = Control.DATE;
        break;
      default:
        this.fieldType = '';
    }
    this.fieldPlaceholder = fieldToEdit.props.placeholder || '';
    this.isRequired = fieldToEdit.props.required;
    this.formOptions = fieldToEdit.props.options || [];
    this.minLength = fieldToEdit.props.minLength || 0;
    this.maxLength = fieldToEdit.props.maxLength || 500;

    // Store the index for update
    this.editIndex = index;
    // Open the modal for editing
    this.openModal(this.fieldType);
  }
  ngAfterViewInit() {
    this.loadForm();
  }
  // Open modal to add fields
  openModal(type: number) {
    // this.resetModalInputs();
    this.fieldType = type;
    // this.isCheckBoxOrRadio = type == Control.CHECKBOX || type == Control.RADIO;
    if (this.fieldType == Control.CHECKBOX || this.fieldType == Control.RADIO || this.fieldType == Control.SELECT) {
      this.isCheckBoxOrRadio = true; // Show the options
    } else {
      this.isCheckBoxOrRadio = false; // Hide the options
    }
    const modalElement = document.getElementById('exampleModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  onFieldTypeChange() {
    if (this.fieldType == Control.CHECKBOX || this.fieldType == Control.RADIO || this.fieldType == Control.SELECT) {
      this.isCheckBoxOrRadio = true; // Show the options
    } else {
      this.isCheckBoxOrRadio = false; // Hide the options
    }
  }

  // Reset modal input fields
  resetModalInputs() {
    this.fieldLabel = '';
    this.fieldType = '';
    this.fieldPlaceholder = '';
    this.isRequired = false;
    this.options = [];
    this.minLength = 30;
    this.maxLength = 30;
    this.submitted = false;
  }

  addOption() {
    debugger
    // add option
    this.options.push({ label: '', value: '' });
  }

  // Remove option
  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  // Add the form control to the fields array
  addControl(fieldLabelInput) {
    this.submitted = true;
    if (fieldLabelInput.invalid) {
      return; // return if invalid
    }
    let fieldConfig: FormlyFieldConfig;
    debugger;
    switch (this.fieldType) {
      case Control.TEXTBOX:
        fieldConfig = {
          key: 'textField' + this.fields.length,
          type: 'input',
          templateOptions: {
            label: this.fieldLabel,
            placeholder: this.fieldPlaceholder || 'Enter ' + this.fieldLabel,
            required: this.isRequired,
            minLength: this.minLength,
            maxLength: this.maxLength,
            readonly: this.isreadOnly,
          },
        };
        break;

      case Control.TEXTAREA:
        fieldConfig = {
          key: 'textareaField' + this.fields.length,
          type: 'textarea',
          templateOptions: {
            label: this.fieldLabel,
            placeholder: this.fieldPlaceholder || 'Enter ' + this.fieldLabel,
            required: this.isRequired,
            minLength: this.minLength,
            maxLength: this.maxLength,
            readonly: this.isreadOnly,
          },
        };
        break;

      case Control.CHECKBOX:
        fieldConfig = {
          key: 'checkboxField' + this.fields.length,
          type: 'checkbox',
          templateOptions: {
            label: this.fieldLabel,
            options: this.options,
            required: this.isRequired,
            readonly: this.isreadOnly,
          },
        };
        break;

      case Control.RADIO:
        fieldConfig = {
          key: 'radioField' + this.fields.length,
          type: 'radio',
          templateOptions: {
            label: this.fieldLabel,
            options: this.options,
            required: this.isRequired,
            readonly: this.isreadOnly,
          },
        };
        break;

      case Control.SELECT:
        fieldConfig = {
          key: 'selectField' + this.fields.length,
          type: 'select',
          templateOptions: {
            label: this.fieldLabel,
            options: this.options,
            required: this.isRequired,
            readonly: this.isreadOnly,
          },
        };
        break;

      case Control.DATE:
        fieldConfig = {
          key: 'dateField' + this.fields.length,
          type: 'input',
          templateOptions: {
            label: this.fieldLabel,
            placeholder: this.fieldPlaceholder || 'Select ' + this.fieldLabel,
            required: this.isRequired,
            type: 'date',
            readonly: this.isreadOnly,
          },
        };
        break;

      default:
        return;
    }
    debugger;
    if (!this.isEdit) {
      // If not edite
      this.fields.push(fieldConfig);
    } else {
      // If edited
      this.fields[this.editIndex] = fieldConfig;
    }
    this.saveForm(); // Save the updated form to localStorage
    this.resetModalInputs(); //reset form input
    this.model = { ...this.model };
    const modalElement = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
  saveForm() {
    // Save the form fields to localStorage
    localStorage.setItem('formFields', JSON.stringify(this.fields));
  }
  loadForm() {
    // Load the form fields from localStorage
    const savedFields = localStorage.getItem('formFields');
    if (savedFields) {
      this.fields = JSON.parse(savedFields);
    }
  }
}
