// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-mine',
//   templateUrl: './mine.component.html',
//   styleUrls: ['./mine.component.sass']
// })
// export class MineComponent {

// }
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
    <div class="sharia-banner">
      <span class="icon">☽</span>
      <span>التعدين هو عمل حقيقي لتأمين الشبكة — المكافأة (10 DNR) مقابل خدمة، وليست ربحاً من الربا.</span>
    </div>

    <div class="grid-2">

      <!-- Mine panel -->
      <div class="card" style="margin:0">
        <div class="card-header"><span class="card-title">⛏ تعدين كتلة جديدة</span></div>
        <div class="card-body">

          @if (mining()) {
            <div class="mining-banner">
              <div class="spinner"></div>
              <span>جاري إيجاد الـ hash... يُرجى الانتظار</span>
            </div>
          }

          @if (alertMsg()) {
            <div class="alert" [class]="alertType() === 'ok' ? 'alert-success' : 'alert-error'">
              {{ alertMsg() }}
            </div>
          }

          <div class="form-group">
            <label>عنوان المُعدِّن (يستلم المكافأة)</label>
            <select [(ngModel)]="minerAddr">
              <option value="">— اختر المُعدِّن —</option>
              @for (w of bc.wallets(); track w.address) {
                <option [value]="w.address">{{ w.name }}</option>
              }
            </select>
          </div>

          <div class="info-row">
            <div class="info-box">
              <div class="muted" style="font-size:11px">مكافأة التعدين</div>
              <div class="mono" style="font-size:22px;font-weight:600;color:var(--green)">10 DNR</div>
            </div>
            <div class="info-box">
              <div class="muted" style="font-size:11px">معاملات معلقة</div>
              <div class="mono" style="font-size:22px;font-weight:600;color:var(--gold)">
                {{ bc.pendingCount() }}
              </div>
            </div>
          </div>

          <button
            class="btn btn-primary"
            [disabled]="mining() || !minerAddr || bc.pendingCount() === 0"
            (click)="mine()"
          >
            {{ mining() ? 'جاري التعدين...' : '⛏ بدء التعدين' }}
          </button>

          @if (bc.pendingCount() === 0) {
            <p style="text-align:center;font-size:12px;color:var(--muted);margin-top:8px">
              لا توجد معاملات معلقة — أضف معاملات أولاً من صفحة التحويل
            </p>
          }
        </div>
      </div>

      <!-- Info panel -->
      <div class="card" style="margin:0">
        <div class="card-header"><span class="card-title">معلومات التعدين</span></div>
        <div class="card-body">
          <div class="stat-list">
            <div class="stat-item">
              <span class="muted">صعوبة التعدين</span>
              <span class="mono" style="font-weight:600">{{ bc.stats()?.difficulty ?? 2 }} أصفار</span>
            </div>
            <div class="stat-item">
              <span class="muted">الكتلة التالية</span>
              <span class="mono" style="font-weight:600">#{{ bc.blocks().length }}</span>
            </div>
            <div class="stat-item">
              <span class="muted">رسوم التحويل</span>
              <span style="font-weight:600;color:var(--green)">0 DNR</span>
            </div>
            <div class="stat-item">
              <span class="muted">آخر hash</span>
              <span class="mono muted" style="font-size:11px">
                {{ bc.blocks().length > 0 ? bc.shortHash(bc.blocks()[bc.blocks().length-1].hash) : '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Mined blocks history -->
    @if (minedHistory().length > 0) {
      <div class="card">
        <div class="card-header"><span class="card-title">سجل التعدين</span></div>
        <div class="card-body" style="padding:0">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>المُعدِّن</th>
                <th>المعاملات</th>
                <th>Nonce</th>
                <th>الوقت</th>
              </tr>
            </thead>
            <tbody>
              @for (b of minedHistory(); track b.index) {
                <tr>
                  <td><span class="badge badge-green">#{{ b.index }}</span></td>
                  <td style="font-size:13px">{{ bc.walletName(b.miner) }}</td>
                  <td>{{ b.transactions.length }}</td>
                  <td class="mono muted" style="font-size:12px">{{ b.nonce.toLocaleString('ar-SA') }}</td>
                  <td class="muted" style="font-size:12px">{{ bc.formatTime(b.timestamp) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
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
