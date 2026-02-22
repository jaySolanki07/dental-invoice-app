import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private invoiceData: any = null;

  setInvoice(data: any): void {
    this.invoiceData = data;
  }

  getInvoice(): any {
    return this.invoiceData;
  }

  clearInvoice(): void {
    this.invoiceData = null;
  }
  
  private readonly STORAGE_KEY = 'invoiceDraft';

  setInvoiceDraft(data: any): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getInvoiceDraft(): any {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearInvoiceDraft(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}