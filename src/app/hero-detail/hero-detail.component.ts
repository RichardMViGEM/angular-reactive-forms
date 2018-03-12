import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { Hero, Address, Automotive, STATES, TYPES } from '../data-model';
import { HeroService } from '../hero.service';
// import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})

export class HeroDetailComponent implements OnChanges {

  /** Properties
   * ###########
   */
  @Input() hero: Hero;
  heroForm: FormGroup;
  states = STATES;
  types = TYPES;
  nameChangeLog: string[] = [];
  secretLairsCollapsed;

  defaultCollapseSubMenus = true;     // true: submenus are collapsed OnInit; false: submenus are expanded OnInit

  /** Virtual Properties
   * ###################
   */

  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  };

  get automotives(): FormArray {
    return this.heroForm.get('automotives') as FormArray;
  }

  /** Functions
   * ##########
   */

   /** toggle secret lairs submenu
    * toggles status expanded of the Secret Lairs submenu
    * if not defiend; sets it according to defaultCollapseSubMenus
    * defaultCollapseSubMenus = true   -> submenus are initially collapsed
    * defaultCollapseSubMenus = false  -> submenus are initially expanded
    */
  // togglesecretLairsCollapsed(newValue: boolean = this.defaultCollapseSubMenus): void {
    toggleSecretLairsCollapsed(): void {
    if (typeof this.secretLairsCollapsed =='undefined') {
      this.secretLairsCollapsed = this.defaultCollapseSubMenus;
      return;
    }

    if(this.secretLairsCollapsed) {
      this.secretLairsCollapsed = false;
    } else {
      this.secretLairsCollapsed = true;
    }
  }
  /** constructor
   * implicitly created FormBuilder formBuilder is a factory. Its method 'group' creates a FormGroup
   * .group() takes object with [key, values] of type [FormControl names, FormControl definitions]
   */
  constructor(
    private formBuilder: FormBuilder,
    private heroService: HeroService
  ) {
    this.createForm();
  }

  /** createForm
   * .group() builds a FormGroup including FormControllers as defined by [FormControl name, FormcControl definition] pairs
   * such as [name: '']
   */
   createForm() {
    this.heroForm = this.formBuilder.group({           // parent FormGroup
      name: ['', Validators.required],
      secretLairs: this.formBuilder.array([]),         // secretLairs is initially an empty FormArray
      automotives: this.formBuilder.array([]),
      power: '',
      sidekick: ''
    });
  }

  /** setAddresses method
   * replaces the 'secretLairs' FormArray with a new FormArray, based on an array of adress FormGroups.
   */
  setAddresses(addresses: Address[]) {
    const addressFormGroups = addresses.map(itAddress => this.formBuilder.group(itAddress));
    const addressFormArray = this.formBuilder.array(addressFormGroups);
    this.heroForm.setControl('secretLairs', addressFormArray);
  }

  setAutomotives(automotives: Automotive[]) {
    const automotiveFormGroups = automotives.map(itAutomotive => this.formBuilder.group(itAutomotive));
    const automotiveFormArray = this.formBuilder.array(automotiveFormGroups);
    this.heroForm.setControl('automotives', automotiveFormArray);
  }

  /** Lifecycle-hook
   * is called each time any data-bound property of a directive changes (INCLUDING at OnInit())
   * is called each time the picked hero (selectedHero) in the parent component is changed (@input() property is changed in this case)
   */
  ngOnChanges() {
    this.rebuildForm();
  }

  ngOnInit() {
    this.toggleSecretLairsCollapsed();
  }

  rebuildForm() {
    this.heroForm.reset({
      name: this.hero.name
    });
    this.setAddresses(this.hero.addresses);
    this.setAutomotives(this.hero.automotives);

    // this.togglesecretLairsCollapsed();
  }

  addLair() {
    this.secretLairs.push(this.formBuilder.group(new Address()));
  }

  removeLair(addressToRemove: number) {
    this.secretLairs.removeAt(addressToRemove);
    this.heroForm.markAsTouched();
  }

  logNameChange() {
    const nameControl = this.heroForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }

  onSubmit() {
    this.hero = this.prepareSaveHero();
    this.heroService.updateHero(this.hero).subscribe();
    this.rebuildForm();
  }

  prepareSaveHero(): Hero {
    const formModel = this.heroForm.value;
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );

    // create and return a new Hero object
    // this contains values of the original hero (id, name) as well as a deep copy of changed form model values
    const saveHero: Hero = {
      id: this.hero.id,
      name: formModel.name as string,
      addresses: secretLairsDeepCopy,
      automotives: this.hero.automotives
    }

    return saveHero;
  }

  revert() {
    this.rebuildForm();
  }
}
