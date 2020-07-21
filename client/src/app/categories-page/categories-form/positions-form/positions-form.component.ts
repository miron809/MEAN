import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PositionsService } from '../../../shared/services/positions.service';
import { Position } from '../../../shared/interfaces';
import { MaterialInstance, MaterialService } from '../../../shared/classes/material.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  positions: Position[] = [];
  loading = false;
  positionId = null;
  modal: MaterialInstance;
  form: FormGroup;

  constructor(private positionsService: PositionsService) {
  }

  ngOnInit(): void {
    this.getAllPosition();
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  buildForm() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })
  }

  getAllPosition() {
    this.loading = true;
    this.positionsService.getAllPositions(this.categoryId)
      .pipe()
      .subscribe((positions: Position[]) => {
          this.positions = positions;
          this.loading = false;
        },
        error => {
          MaterialService.toast(error.error.message);
          this.loading = false;
        }
      )
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition)
        .pipe()
        .subscribe(position => {

          this.positions.find((p, idx) => {
            if (p._id === position._id) {
              this.positions[idx] = position;
            }
          });

            MaterialService.toast('Position has been updated');
          },
          error => {
            this.form.enable();
            MaterialService.toast(error.error.message)
          },
          this.completed.bind(this)
        )

    } else {
      this.positionsService.create(newPosition)
        .pipe()
        .subscribe(position => {
            MaterialService.toast('Position has been created');
            this.positions.push(position)
          },
          error => {
            this.form.enable();
            MaterialService.toast(error.error.message)
          },
          this.completed.bind(this)
        )
    }
  }

  completed() {
    this.modal.close();
    this.form.enable();
    this.form.reset();
    MaterialService.updateTextInputs();
  }

  onDeletePosition(event:Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Do you want to delete position with name "${position.name}" ?`);

    if (decision) {
      this.positionsService.delete(position)
        .subscribe(
          response => {
            this.positions = this.positions.filter(p => p._id !== position._id);
            MaterialService.toast(response.message);
          },
          error => MaterialService.toast(error.error.message)
        )
    }
  }
}
