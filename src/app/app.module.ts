import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  MaterialModule, MdInputModule, MdSidenavModule,
  MdButtonModule, MdCardModule, MdMenuModule, MdDatepickerModule,
  MdNativeDateModule, MdTableModule,
  MdToolbarModule, MdIconModule, MdSlideToggleModule
} from '@angular/material';
import { HttpModule } from '@angular/http';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CustomerComponent } from './customer/customer.component';
import { FormControl, Validators } from '@angular/forms';
import { DeliveryComponent } from './delivery/delivery.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProjectComponent } from './project/project.component';
import { ProductComponent } from './product/product.component';
import { TerminalComponent } from './terminal/terminal.component';
import { ManufactureLineComponent } from './manufacture-line/manufacture-line.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VariantComponent } from './variant/variant.component';
import { ManufacturingComponent } from './manufacturing/manufacturing.component';
import { ManufactureLineTypeComponent } from './manufacture-line-type/manufacture-line-type.component';
import { CircularProgressComponent } from './circular-progress/circular-progress.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { ProcessComponent } from './process/process.component';
import { TerminalCategoryComponent } from './terminal-category/terminal-category.component';
import { StockComponent } from './stock/stock.component';
import { ManufactureLineListComponent } from './manufacture-line-list/manufacture-line-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { ManufacturingListComponent } from './manufacturing-list/manufacturing-list.component';
import { ProcessListComponent } from './process-list/process-list.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { TerminalListComponent } from './terminal-list/terminal-list.component';
import { VariantListComponent } from './variant-list/variant-list.component';
import { HeaderComponent } from './header/header.component';
import { Routes, RouterModule } from "@angular/router";
import { ChartsModule } from 'ng2-charts';
import { CdkTableModule } from '@angular/cdk';
import { StockListComponent } from './stock-list/stock-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { RawMaterialListComponent } from './raw-material-list/raw-material-list.component';
import { ManufacturingLineTypeListComponent } from './manufacturing-line-type-list/manufacturing-line-type-list.component';
import { TerminalCategoryListComponent } from './terminal-category-list/terminal-category-list.component';
import { SimpleTextComponent } from './customFieldTypes/simple-text/simple-text.component';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { ProductModelComponent } from './product-model/product-model.component';

import { RadioButtonComponent } from './customFieldTypes/radio-button/radio-button.component';
import { SelectComponent } from './customFieldTypes/select/select.component';
import { MultipleChoiceComponent } from './customFieldTypes/multiple-choice/multiple-choice.component';
import { RichTextComponent } from './customFieldTypes/rich-text/rich-text.component';
import { NumericValueComponent } from './customFieldTypes/numeric-value/numeric-value.component';
import { AmountWithCurrencyComponent } from './customFieldTypes/amount-with-currency/amount-with-currency.component';
import { NumericFieldWithUnitComponent } from './customFieldTypes/numeric-field-with-unit/numeric-field-with-unit.component';
import { DateComponent } from './customFieldTypes/date/date.component';
import { YesNoComponent } from './customFieldTypes/yes-no/yes-no.component';
import {ParametersService} from './custom-fields/field-type-parameters.service';
import { CustomFieldListComponent } from './custom-field-list/custom-field-list.component';

const routes: Routes = [
  { path: '', component: CircularProgressComponent },
  { path: 'terminal', component: TerminalComponent },
  { path: 'variant', component: VariantComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'manufacturing', component: ManufacturingComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'stock', component: StockComponent },
  { path: 'terminal-category', component: TerminalCategoryComponent },
  { path: 'process', component: ProcessComponent },
  { path: 'manufactureLine', component: ManufactureLineComponent },
  { path: 'product', component: ProductComponent },
  { path: 'manufacturelinetype', component: ManufactureLineTypeComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'rawmaterial', component: RawMaterialComponent },
  { path: 'manufacturelineList', component: ManufactureLineListComponent },
  { path: 'customerlist', component: CustomerListComponent },
  { path: 'deliveryList', component: DeliveryListComponent },
  { path: 'employeelist', component: EmployeeListComponent },
  { path: 'manufacturinglist', component: ManufacturingListComponent },
  { path: 'processList', component: ProcessListComponent },
  { path: 'projectList', component: ProjectListComponent },
  { path: 'terminalList', component: TerminalListComponent },
  { path: 'variantList', component: VariantListComponent },
  { path: 'customerList', component: CustomerListComponent },
  { path: 'invoiceList', component: InvoiceListComponent },
  { path: 'stockList', component: StockListComponent },
  { path: 'terminalCategoryList', component: TerminalCategoryListComponent },
  { path: 'productList', component: ProductListComponent },
  { path: 'manufactureLineTypeList', component: ManufacturingLineTypeListComponent },
  { path: 'rawMaterialList', component: RawMaterialListComponent },
  { path: 'project/:id', component: ProjectComponent },
  { path: 'manufactureLine/:id', component: ManufactureLineComponent },
  { path: 'customer/:id', component: CustomerComponent },
  { path: 'delivery/:id', component: DeliveryComponent },
  { path: 'employee/:id', component: EmployeeComponent },
  { path: 'manufacturing/:id', component: ManufacturingComponent },
  { path: 'process/:id', component: ProcessComponent },
  { path: 'terminal/:id', component: TerminalComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'manufacturelinetype/:id', component: ManufactureLineTypeComponent },
  { path: 'stock/:id', component: StockComponent },
  { path: 'terminal-category/:id', component: TerminalCategoryComponent },
  { path: 'invoice/:id', component: InvoiceComponent },
  { path: 'variant/:id', component: VariantComponent },
  { path: 'rawmaterial/:id', component: RawMaterialComponent },
  { path: 'customFields', component: CustomFieldsComponent },
  { path : 'productModel' , component : ProductModelComponent},
  { path : 'customFieldList' , component : CustomFieldListComponent},
  { path : 'customField/:id' , component : CustomFieldsComponent }

];
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CustomerComponent,
    DeliveryComponent,
    EmployeeComponent,
    ProjectComponent,
    ProductComponent,
    TerminalComponent,
    ManufactureLineComponent,
    InvoiceComponent,
    VariantComponent,
    CircularProgressComponent,
    ManufacturingComponent,
    ProcessComponent,
    TerminalCategoryComponent,
    StockComponent,
    HeaderComponent,
    RawMaterialComponent,
    ManufactureLineTypeComponent,
    ManufactureLineListComponent,
    CustomerListComponent,
    DeliveryListComponent,
    EmployeeListComponent,
    ManufacturingListComponent,
    ProcessListComponent,
    ProjectListComponent,
    TerminalListComponent,
    VariantListComponent,
    InvoiceListComponent,
    StockListComponent,
    TerminalCategoryListComponent,
    ProductListComponent,
    ManufacturingLineTypeListComponent,
    RawMaterialListComponent,
    SimpleTextComponent,
    CustomFieldsComponent,
    ProductModelComponent,
    RadioButtonComponent,
    SelectComponent,
    MultipleChoiceComponent,
    RichTextComponent,
    NumericValueComponent,
    AmountWithCurrencyComponent,
    NumericFieldWithUnitComponent,
    DateComponent,
    YesNoComponent,
    CustomFieldListComponent

  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MdSidenavModule,
    MdButtonModule,
    MdCardModule,
    MdMenuModule, MdSlideToggleModule,
    MdToolbarModule,
    MdIconModule,
    MdInputModule,
    CdkTableModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MdTableModule,
    RouterModule.forRoot(routes, { useHash: true }),
    ChartsModule
  ],
  providers : [ParametersService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
