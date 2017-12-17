import { Component, OnInit } from '@angular/core';
import { ManufactureLineService } from './manufacture-line.service';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap ,Router} from '@angular/router';



@Component({
  selector: 'app-manufacture-line',
  templateUrl: './manufacture-line.component.html',
  styleUrls: ['./manufacture-line.component.css'],
  providers: [ManufactureLineService]
})
export class ManufactureLineComponent implements OnInit {

  states = [
    { value: 'state-1', viewValue: 'State1' },
    { value: 'state-2', viewValue: 'State2' },
    { value: 'state-3', viewValue: 'State3' }

  ];

  rForm: FormGroup;
  _id = '';
  effective = '';
  state = '';
  inputTerminalState = '';
  outputTerminalState = '';
  displayState = '';
  processOrder = '';


  constructor(private ManufactureLineService: ManufactureLineService,
    private FormBuilder: FormBuilder,
    private route: ActivatedRoute,
  private router : Router) {

    let id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this._id = id;
      let self = this;
      this.ManufactureLineService.read((function (data) {
        self.setValues(data);
        self.ngOnInit();
      }), this.ManufactureLineService.handleError, id)
    }
  }

  ngOnInit() {
    this.rForm = this.FormBuilder.group({
      effective: [
        this.effective, [
          Validators.required]
      ],

      state: [
        this.state, [
          Validators.required]
      ],

      processOrder: [
        this.processOrder, [
          Validators.required]
      ],
      inputTerminalState: [
        'this.inputTerminalState', [
          Validators.required
        ]
      ],
      outputTerminalState: [
        'this.outputTerminalState', [
          Validators.required
        ]
      ],
      displayState: [
        'this.displayState', [
          Validators.required
        ]
      ]

    });

  }

  private setValues(data: any) {
    this.effective = data.effective;
    this.state = data.state;
    this.inputTerminalState = data.inputTerminalState;
    this.outputTerminalState = data.outpuTerminalState;
    this.processOrder = data.processOrder;
    this.displayState = data.displayState;
  }

  addManufactureLine(post) {
    if (this._id == '') {
      this.ManufactureLineService.create(() => { this.router.navigate(['manufacturelineList'])}, this.ManufactureLineService.handleError, post);
    }
    else {
      post._id = this._id;
      this.ManufactureLineService.update(() => { this.router.navigate(['manufacturelineList'])}, this.ManufactureLineService.handleError, post);
      
    }
  }

}
