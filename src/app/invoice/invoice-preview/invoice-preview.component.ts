import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { InvoiceService } from '../invoice.service';
import { Router } from '@angular/router';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule,
    ...MATERIAL_IMPORTS],
  templateUrl: './invoice-preview.component.html',
  styleUrl: './invoice-preview.component.scss'
})
export class InvoicePreviewComponent {
  invoice: any;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invoice = this.invoiceService.getInvoice();

    // If user refreshes or accesses directly
    if (!this.invoice) {
      this.router.navigate(['/invoice']);
    }
  }

  backToEdit(): void {
    this.router.navigate(['/invoice']);
  }

 downloadPdf(): void {
  const doc = new jsPDF('p', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();

  // -------------------------
  // LOGO
  // -------------------------
  const img = new Image();
  img.src = 'assets/logo.png';

  img.onload = () => {
    doc.addImage(img, 'PNG', 15, 12, 28, 28);

    // -------------------------
    // CLINIC HEADER
    // -------------------------
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('UNICORN DIGITAL DENTAL LAB', 50, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      [
        '62/A Jantanagar,',
        'Opp. Jain Temple,',
        'Chandkheda Road, Ahmedabad, Gujarat - 382424',
        'Phone: +91 98765 43210'
      ],
      50,
      26
    );

    // -------------------------
    // INVOICE META (RIGHT)
    // -------------------------
    doc.setFontSize(10);
    doc.text(`Invoice #: ${this.invoice.invoiceNumber}`, pageWidth - 15, 26, {
      align: 'right'
    });
    doc.text(
      `Date: ${new Date(this.invoice.invoiceDate).toLocaleDateString()}`,
      pageWidth - 15,
      32,
      { align: 'right' }
    );

    // Divider
    doc.setDrawColor(180);
    doc.line(15, 45, pageWidth - 15, 45);

    // -------------------------
    // DOCTOR / PATIENT DETAILS
    // -------------------------
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor Details', 15, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${this.invoice.patientName}`, 15, 62);
    doc.text(`Phone: ${this.invoice.patientPhone || '-'}`, 15, 68);

    // -------------------------
    // TABLE
    // -------------------------
    const tableBody = this.invoice.items.map((item: any) => [
      item.treatment,
      item.quantity.toFixed(2),
      item.price.toFixed(2),
      (item.quantity * item.price).toFixed(2)
    ]);

    autoTable(doc, {
      startY: 78,
      head: [['Treatment', 'Qty', 'Price (Rs.)', 'Total (Rs.)']],
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        halign: 'center'
      },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    // -------------------------
    // TOTALS
    // -------------------------
    const finalY = (doc as any).lastAutoTable.finalY + 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Subtotal : Rs. ${this.invoice.subtotal.toFixed(2)}`,
      pageWidth - 15,
      finalY,
      { align: 'right' }
    );

    // -------------------------
    // FOOTER
    // -------------------------
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Conditions: Jurisdiction Ahmedabad only. Payment to be made within 7 days.',
      pageWidth / 2,
      282,
      { align: 'center' }
    );
    doc.text(
      'Thank you for choosing Unicorn Digital Dental Lab',
      pageWidth / 2,
      290,
      { align: 'center' }
    );

    // -------------------------
    // SAVE & CLEAR
    // -------------------------
    doc.save(`${this.invoice.invoiceNumber}.pdf`);
    this.invoiceService.clearInvoice();
  };
}
}
