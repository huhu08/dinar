// src/app/components/mine/mine.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '../../services/blockchain.service';
import { Block } from '../../models/blockchain.models';
//main mine component
@Component({
  selector: 'app-mine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    
  `,
  styles: [`
  `]
})
export class MineComponent implements OnInit {
  minerAddr = '';
  mining    = signal(false);
  alertMsg  = signal<string|null>(null);
  alertType = signal<'ok'|'err'>('ok');

  minedHistory = () => [...this.bc.blocks()].filter(b => b.index > 0).reverse().slice(0, 10);

  constructor(public bc: BlockchainService) {}

  ngOnInit(): void { this.bc.loadAll(); }

  mine(): void {
    if (!this.minerAddr || this.bc.pendingCount() === 0) return;
    this.mining.set(true);
    this.bc.mineBlock(this.minerAddr).subscribe(res => {
      this.mining.set(false);
      if (res.success && res.data) {
        this.alert(`✓ تم تعدين الكتلة #${res.data.index} — Nonce: ${res.data.nonce.toLocaleString('ar-SA')}`, 'ok');
      } else {
        this.alert(res.message || 'حدث خطأ أثناء التعدين', 'err');
      }
    });
  }

  private alert(msg: string, type: 'ok'|'err'): void {
    this.alertMsg.set(msg); this.alertType.set(type);
    setTimeout(() => this.alertMsg.set(null), 5000);
  }
}
