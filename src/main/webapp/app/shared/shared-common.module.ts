import { NgModule } from '@angular/core';

import { PalaverSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [PalaverSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [PalaverSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class PalaverSharedCommonModule {}
