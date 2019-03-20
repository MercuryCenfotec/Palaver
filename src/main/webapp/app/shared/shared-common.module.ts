import { NgModule } from '@angular/core';
import { DragulaModule } from 'ng2-dragula';

import { PalaverSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [PalaverSharedLibsModule, DragulaModule.forRoot()],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [PalaverSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent, DragulaModule]
})
export class PalaverSharedCommonModule {}
