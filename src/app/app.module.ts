import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MineComponent } from './mine/mine.component';
import { TransferComponent } from './transfer/transfer.component';
import { WalletsComponent } from './wallets/wallets.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MineComponent,
    TransferComponent,
    WalletsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
