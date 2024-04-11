import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-member-dialog-component',
  templateUrl: './add-member-dialog-component.component.html',
  styleUrl: './add-member-dialog-component.component.scss'
})
export class AddMemberDialogComponentComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddMemberDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: ['', Validators.required],
      displayName: ['', Validators.required],
      memberType: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.setupFormChanges();
  }

  setupFormChanges() {
    const memberTypeControl = this.form.get('memberType');
    
    if (memberTypeControl) { // Vérifiez que l'objet n'est pas null
      memberTypeControl.valueChanges.subscribe(value => {
        // Mettez à jour le champ displayName en fonction de la sélection
        if (value === 'PERSON') {
          this.form.patchValue({
            displayName: 'Nom Personne', // Vous pourriez vouloir initialiser ceci avec des données dynamiques
            id: 'person_' // Pensez à générer ou initialiser ceci dynamiquement si nécessaire
          });
        } else if (value === 'GROUP') {
          this.form.patchValue({
            displayName: 'Nom Groupe', // Comme ci-dessus, initialisez avec des valeurs significatives
            id: 'group_' // Idem
          });
        }
      });
    }
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
