// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-transfer',
//   templateUrl: './transfer.component.html',
//   styleUrls: ['./transfer.component.sass']
// })
// export class TransferComponent {

// }
// src/app/components/transfer/transfer.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: '/mine.transfer.html',
  styles: [`
    .balance-display {
      display: flex; justify-content: space-between; align-items: center;
      background: var(--green-light); border-radius: 8px;
      padding: 10px 14px; margin-bottom: 14px;
    }
    .pending-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 16px; border-bottom: 1px solid #f0f4f2;
    }
    .pending-item:last-child { border-bottom: none; }
    .form-group { margin-bottom: 14px; }
  `],
})
export class TransferComponent implements OnInit {
  fromAddr = '';
  toAddr   = '';
  amount   = 0;
  sending  = signal(false);
  alertMsg = signal<string | null>(null);
  alertType = signal<'ok'|'err'>('ok');

  fromBalance = computed(() => {
    const w = this.bc.wallets().find(w => w.address === this.fromAddr);
    return w?.balance ?? 0;
  });

  isValid = computed(() =>
    !!this.fromAddr && !!this.toAddr && this.amount > 0 &&
    this.fromAddr !== this.toAddr && this.amount <= this.fromBalance()
  );

  constructor(public bc: BlockchainService) {}

  ngOnInit(): void { this.bc.loadAll(); }

  onFromChange(): void { this.toAddr = ''; }

  send(): void {
    if (!this.isValid()) return;
    this.sending.set(true);
    this.bc.sendTransaction(this.fromAddr, this.toAddr, this.amount).subscribe(res => {
      this.sending.set(false);
      if (res.success) {
        this.showAlert('تمت إضافة المعاملة — اذهب للتعدين لتأكيدها', 'ok');
        this.amount = 0;
        this.bc.loadWallets().subscribe();
      } else {
        this.showAlert(res.message || 'حدث خطأ', 'err');
      }
    });
  }

  private showAlert(msg: string, type: 'ok'|'err'): void {
    this.alertMsg.set(msg);
    this.alertType.set(type);
    setTimeout(() => this.alertMsg.set(null), 4000);
  }
}
