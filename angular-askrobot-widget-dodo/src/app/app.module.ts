import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CardWrapperModule } from './components/card-wrapper/card-wrapper.module';
import { CardModule } from '../../projects/angular-askrobot-widget-dodo/src/lib/components/card/card.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CardModule,
    CardWrapperModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}