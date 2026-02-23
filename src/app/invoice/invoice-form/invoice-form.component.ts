import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';

import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_IMPORTS],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss'
})
export class InvoiceFormComponent {

  invoiceForm!: FormGroup;
  invoiceNumber!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    const savedInvoice = this.invoiceService.getInvoiceDraft();
    // this.generateInvoiceNumber();
    this.initializeForm();
    if (savedInvoice) {
    this.invoiceNumber = savedInvoice.invoiceNumber;

    this.invoiceForm.patchValue({
      patientName: savedInvoice.patientName,
      patientPhone: savedInvoice.patientPhone,
      invoiceDate: savedInvoice.invoiceDate
    });

    this.items.clear();

    savedInvoice.items.forEach((item: any) => {
      this.items.push(
        this.fb.group({
          treatment: [item.treatment, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          price: [item.price, [Validators.required, Validators.min(0)]],
        })
      );
    });
  } else {
    this.generateInvoiceNumber();
    this.addItem();
  }
    // this.addItem(); // start with one row
  }

  private initializeForm(): void {
    this.invoiceForm = this.fb.group({
      patientName: ['', Validators.required],
      patientPhone: [''],
      invoiceDate: [new Date(), Validators.required],
      items: this.fb.array([])
    });
  }

  private generateInvoiceNumber(): void {
    const timestamp = Date.now();
    this.invoiceNumber = `INV-${timestamp}`;
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        treatment: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(0)]]
      })
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  getSubtotal(): number {
    return this.items.controls.reduce((total, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return total + qty * price;
    }, 0);
  }

  previewInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const invoicePayload = {
      invoiceNumber: this.invoiceNumber,
      ...this.invoiceForm.value,
      subtotal: this.getSubtotal()
    };

    this.invoiceService.setInvoice(invoicePayload);
    this.invoiceService.setInvoiceDraft(invoicePayload);
    this.router.navigate(['/preview']);
  }
}
