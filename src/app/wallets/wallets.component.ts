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
    .form-group { margin-bottom: 14px; }
    .mining-banner {
      display: flex; align-items: center; gap: 10px;
      background: var(--gold-light); border: 1px solid #FAC775;
      border-radius: 8px; padding: 10px 14px;
      font-size: 13px; color: #633806; margin-bottom: 14px;
    }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid #FAC775; border-top-color: var(--gold);
      border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
    .info-box { background: var(--bg); border-radius: 8px; padding: 12px; }
    .stat-list { display: flex; flex-direction: column; gap: 10px; }
    .stat-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0; border-bottom: 1px solid #f0f4f2; font-size: 13px;
    }
    .stat-item:last-child { border-bottom: none; }
    .table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .table th { text-align: right; padding: 10px 14px; color: var(--muted); font-weight: 500; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid var(--border); }
    .table td { padding: 11px 14px; border-bottom: 1px solid #f0f4f2; }
    .table tr:last-child td { border-bottom: none; }
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
