// Copyright (c) qzhang
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  //WidgetModel,
  //WidgetView,
  ISerializers,
} from '@jupyter-widgets/base';
// import { List } from '@jupyter-widgets/base';
// import * as ipywidgets from "@jupyter-widgets/base";

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

export class EditCLMParamModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: EditCLMParamModel.model_name,
      _model_module: EditCLMParamModel.model_module,
      _model_module_version: EditCLMParamModel.model_module_version,
      _view_name: EditCLMParamModel.view_name,
      _view_module: EditCLMParamModel.view_module,
      _view_module_version: EditCLMParamModel.view_module_version,
        
      saverequest: '',

      pftname: [
          "not_vegetated                           ",
          "needleleaf_evergreen_temperate_tree     ",
          "needleleaf_evergreen_boreal_tree        ",
          "needleleaf_deciduous_boreal_tree        ",
          "broadleaf_evergreen_tropical_tree       ",
          "broadleaf_evergreen_temperate_tree      ",
          "broadleaf_deciduous_tropical_tree       ",
          "broadleaf_deciduous_temperate_tree      ",
          "broadleaf_deciduous_boreal_tree         ",
          "broadleaf_evergreen_shrub               ",
          "broadleaf_deciduous_temperate_shrub     ",
          "broadleaf_deciduous_boreal_shrub        ",
          "c3_arctic_grass                         ",
          "c3_non-arctic_grass                     ",
          "c4_grass                                ",
          "c3_crop                                 ",
          "c3_irrigated                            ",
          "corn                                    ",
          "irrigated_corn                          ",
          "spring_temperate_cereal                 ",
          "irrigated_spring_temperate_cereal       ",
          "winter_temperate_cereal                 ",
          "irrigated_winter_temperate_cereal       ",
          "soybean                                 ",
          "irrigated_soybean                       "] as string[],
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here

    slatop: { deserialize: (value: any) => value },  // List.serializers,
    flnr: { deserialize: (value: any) => value },  //List.serializers,
    frootcn: { deserialize: (value: any) => value }, // List.serializers,
    froot_leaf: { deserialize: (value: any) => value }, // List.serializers,
    leafcn: { deserialize: (value: any) => value }  // List.serializers

  };

  static model_name = 'EditCLMParamModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'EditCLMParamView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;

  initialize(attributes: any, options: any) {
    super.initialize(attributes, options);
    this.on('msg:custom', this.handleCustomMessage, this);
  }

  handleCustomMessage(msg: any) {
    const evt = msg.content.event;
    const newData = msg.content.new_value;
    alert("Received a msg: " + evt);
    alert("New data = " + newData);

    switch(evt) {
        case 'slatop_changed': {
            this.set('slatop', newData);
            break;
        }
        case 'flnr_changed': {
            this.set('flnr', newData);
            break;
        }
        case 'frootcn_changed': {
            this.set('frootcn', newData);
            break;
        }
        case 'froot_leaf_changed': {
            this.set('froot_leaf', newData);
            break;
        }
        case 'leafcn_changed': {
            this.set('leafcn', newData);
            break;
        }
        default: {  
            console.log("Received a msg: " + evt + "  with New data: " + newData);
            break;  
        }  
    }
    if (msg.content.event.includes('_changed')) {
        this.save_changes();
    }
  }
}

export class EditCLMParamView extends DOMWidgetView {
  private _div0: HTMLDivElement;
  private _div1: HTMLDivElement;
  private _div2: HTMLDivElement;
  private _div3: HTMLDivElement;
  private _div4: HTMLDivElement;

  private _clm_filelbl: HTMLInputElement;
  private _clm_original_file: HTMLInputElement;
  private _clm_newlbl: HTMLInputElement;
  private _clm_new_file: HTMLInputElement;

  private _pftnamelbl: HTMLInputElement;
  private _pftname: HTMLSelectElement;
  private _slatop: HTMLSelectElement;
  private _flnr: HTMLSelectElement;  
  private _frootcn: HTMLSelectElement;
  private _froot_leaf: HTMLSelectElement;
  private _leafcn: HTMLSelectElement;
  private _rmortlbl: HTMLInputElement;
  private _r_mort: HTMLInputElement;

  private _savefilebtn: HTMLInputElement;

  render() {
    this._div0 = document.createElement('div');
    this._div0.classList.add('widget-container', 'widget-box');
    this._div1 = document.createElement('div');
    this._div1.classList.add('widget-container', 'widget-box');
    this._div2 = document.createElement('div');
    this._div2.classList.add('widget-container', 'widget-box');
    this._div3 = document.createElement('div');
    this._div3.classList.add('widget-container', 'widget-box');
    this._div4 = document.createElement('div');
    this._div4.classList.add('widget-container', 'widget-box');

    this._clm_filelbl = document.createElement('input');
    this._clm_filelbl.type = 'label';
    this._clm_filelbl.value = 'clm_parameters_file: ';
    this._clm_filelbl.disabled = true;
    this._clm_filelbl.classList.add('widget-glabel');
    this._div0.appendChild(this._clm_filelbl);

    this._clm_original_file = document.createElement('input');
    this._clm_original_file.type = 'text';
    this._clm_original_file.value = this.model.get('clmnc_file');
    this._clm_original_file.disabled = false;
    this._clm_original_file.classList.add('widget-input');
    this._div0.appendChild(this._clm_original_file);

    this._clm_newlbl = document.createElement('input');
    this._clm_newlbl.type = 'label';
    this._clm_newlbl.value = 'Save to new file: ';
    this._clm_newlbl.disabled = true;
    this._clm_newlbl.classList.add('widget-glabel');
    this._div4.appendChild(this._clm_newlbl);

    this._clm_new_file = document.createElement('input');
    this._clm_new_file.type = 'text';
    this._clm_new_file.value = this.model.get('newclmnc_file');
    this._clm_new_file.disabled = false;
    this._clm_new_file.classList.add('widget-input');
    this._div4.appendChild(this._clm_new_file);

    // Create select element
    this._pftnamelbl = document.createElement('input');
    this._pftnamelbl.type = 'label';
    this._pftnamelbl.value = 'plant function type: ';
    this._pftnamelbl.disabled = true;
    this._pftnamelbl.classList.add('widget-blabel');
    this._div1.appendChild(this._pftnamelbl);

    this._pftname = document.createElement('select'); 
    this._create_dropdown1(this.model.get('pftname'));
    this._pftname.selectedIndex = 0;
    this._pftname.disabled = false;
    this._pftname.classList.add('widget-pftname');
    this._div1.appendChild(this._pftname);

    this._rmortlbl = document.createElement('input');
    this._rmortlbl.type = 'label';
    this._rmortlbl.value = 'Mortality rate: ';
    this._rmortlbl.disabled = true;
    this._rmortlbl.classList.add('widget-blabel');
    this._div1.appendChild(this._rmortlbl);

    this._r_mort = document.createElement('input');
    this._r_mort.type = 'text';
    this._r_mort.value = this.model.get('r_mort');
    this._r_mort.disabled = false;
    this._r_mort.classList.add('widget-num');
    this._div1.appendChild(this._r_mort);

    /* 6 variables: slatop; flnr; frootcn; froot_leaf; leafcn; r_mort*/
    const vars = ['Canopy SLA ', 'Rubisco N allocation', 'Fine root C:N', 'NewRoot C/NewLeaf C', 'Leaf C:N'];
    for (const ind1 in vars) {
        // create the table headers
        const lblelm: HTMLInputElement = document.createElement('input');
        lblelm.type = 'label';
        lblelm.value = vars[ind1];
        lblelm.disabled = true;
        lblelm.classList.add('widget-blabel');
        this._div2.appendChild(lblelm);
    }
    this._slatop = document.createElement('select');
    this._flnr = document.createElement('select');
    this._frootcn = document.createElement('select');
    this._froot_leaf = document.createElement('select');
    this._leafcn = document.createElement('select');
    this._create_dropdown2(this.model.get('slatop'), this._slatop);
    this._slatop.classList.add('widget-number');
    this._div3.appendChild(this._slatop);
    this._create_dropdown2(this.model.get('flnr'), this._flnr);
    this._flnr.classList.add('widget-number');
    this._div3.appendChild(this._flnr);
    this._create_dropdown2(this.model.get('frootcn'), this._frootcn);
    this._frootcn.classList.add('widget-number');
    this._div3.appendChild(this._frootcn);
    this._create_dropdown2(this.model.get('froot_leaf'), this._froot_leaf);
    this._froot_leaf.classList.add('widget-number');
    this._div3.appendChild(this._froot_leaf);
    this._create_dropdown2(this.model.get('leafcn'), this._leafcn);
    this._leafcn.classList.add('widget-number');
    this._div3.appendChild(this._leafcn);

    this._savefilebtn = document.createElement('input');
    this._savefilebtn.type = 'Submit';
    this._savefilebtn.value = 'Save to New .nc file';
    this._savefilebtn.disabled = false;
    this._savefilebtn.classList.add(
        'widget-button',
    );
    this._savefilebtn.setAttribute('href', '#');
    this._savefilebtn.setAttribute('title', 'Save changes to a new .nc file');
    this._savefilebtn.style.outline = 'none';
    this._savefilebtn.addEventListener(
        'click',
        this._onsavebuttonClicked()
    );
    this._div4.appendChild(this._savefilebtn);
      

    // Attach DOM to el
    this.el.appendChild(this._div0);
    this.el.appendChild(this._div1);
    this.el.appendChild(this._div2);
    this.el.appendChild(this._div3);
    this.el.appendChild(this._div4);
    this.el.classList.add('custom-widget');

    
    // Python -> JavaScript update
    // Monitoring the changes in the widget's model (front end)
    this.model.on('change:clmnc_file', this._onOriginalFileChanged, this);
    this.model.on('change:newclmnc_file', this._onNewFileChanged, this);
    this.model.on('change:slatop', this._onSlatopChanged, this);
    this.model.on('change:flnr', this._onFlnrChanged, this);
    this.model.on('change:frootcn', this._onFrootCNChanged, this);
    this.model.on('change:froot_leaf', this._onFrootLeafChanged, this);
    this.model.on('change:leafcn', this._onLeafCNChanged, this);
    this.model.on('change:r_mort', this._onRmortChanged, this);

    // JavaScript -> Python update
    // Listening to changes of the widget's own DOM attribute changes
    this._clm_original_file.onchange = this._onOriginalFileInputChanged.bind(this);
    this._clm_new_file.onchange = this._onNewFileInputChanged.bind(this);
    this._pftname.onchange = this._onPftnameInputChanged.bind(this);
    this._slatop.onchange = this._onSlatopInputChanged.bind(this);
    this._flnr.onchange = this._onFlnrInputChanged.bind(this);
    this._frootcn.onchange = this._onFrootCNInputChanged.bind(this);
    this._froot_leaf.onchange = this._onFrootLeafInputChanged.bind(this);
    this._leafcn.onchange = this._onLeafCNInputChanged.bind(this);
    this._r_mort.onchange = this._onRmortInputChanged.bind(this);

  }

  /**** get/set and other helper methods for render()****/

  // get (Python -> JavaScript update)
  private _onOriginalFileChanged() {
    const neworgclm = this.model.get('clmnc_file')
    this._clm_original_file.value = neworgclm;
    //alert('original clm file' + ' is changed to new value: ' + neworgclm);
  }
  private _onNewFileChanged() {
    const newnewclm = this.model.get('newclmnc_file');
    this._clm_new_file.value = newnewclm;
    //alert('new clm file' + ' is changed to new value: ' + newnewclm);
  }
  private _onSlatopChanged() {
    const newSlatop: number[] = this.model.get('slatop');
    alert('slatop' + ' is changed to new value: ' + newSlatop);
    this._create_dropdown2(newSlatop, this._slatop);
  }
  private _onFlnrChanged() {
    const newFlnr: number[] = this.model.get('flnr');
    alert('flnr' + ' is changed to new value: ' + newFlnr);
    this._create_dropdown2(newFlnr, this._flnr);
  }
  private _onFrootCNChanged() {
    const newFrootcn: number[] = this.model.get('frootcn');
    alert('frootcn' + ' is changed to new value: ' + newFrootcn);
    this._create_dropdown2(newFrootcn, this._frootcn);
  }
  private _onFrootLeafChanged() {
    const newFrootLeaf: number[] = this.model.get('froot_leaf');
    alert('froot_leaf' + ' is changed to new value: ' + newFrootLeaf);
    this._create_dropdown2(newFrootLeaf, this._froot_leaf);
  }
  private _onLeafCNChanged() {
    const newLeafcn: number[] = this.model.get('leafcn');
    alert('leafcn' + ' is changed to new value: ' + newLeafcn);
    this._create_dropdown2(newLeafcn, this._leafcn);
  }
  private _onRmortChanged() {
    const new_rmort = this.model.get('r_mort');
    alert('r_mort' + ' is changed to new value: ' + new_rmort);
    this._r_mort.value = new_rmort;
  }

  // Define a function to create editable options
  private _createEditableOption(value: number, text: number) {
    const optionElement = document.createElement("option");
    optionElement.value = value.toString();
    optionElement.text = text.toString();

    // Add an event listener to allow editing of the option text
    optionElement.addEventListener("dblclick", () => {
      const newOptionText = prompt("Enter new value:", value.toString());
      if (newOptionText !== null) {
        optionElement.text = newOptionText;
      }
    });
    return optionElement;
  }

  private _create_dropdown1(items: string[]) {
    for (const index in items) {
      const optionElement = document.createElement("option");
      optionElement.value = index;
      optionElement.text = items[index];
      this._pftname.appendChild(optionElement);
    }
  }
  private _create_dropdown2(items: number[], dom_sel: HTMLSelectElement) {
    //alert('First, remove all of the children of the dropdown');
    while (dom_sel.firstChild) {
      dom_sel.removeChild(dom_sel.firstChild);
    }
    //alert('Second, recreate the new children of the dropdown');
    for (const index in items) {
      const optionElement = this._createEditableOption(+index, items[index]);
      dom_sel.appendChild(optionElement);
    }
    dom_sel.disabled = false;
    dom_sel.size = 25;
    dom_sel.addEventListener("scroll", function(event) {
        event.preventDefault();
        return false;
    });
    dom_sel.addEventListener("mousedown", function(event) {
        event.preventDefault();
        return false;
    });
    dom_sel.addEventListener("keydown", function(event) {
        event.preventDefault();
        return false;
    });
    //dom_sel.classList.add('widget-select');
  }

  // set (JavaScript -> Python update)
  // get the values updated from the front-end to the Python kernel
  private _onOriginalFileInputChanged() {
    this.model.set('clmnc_file', this._clm_original_file.value);
    this.model.save_changes();
  }
  private _onNewFileInputChanged() {
    this.model.set('newclmnc_file', this._clm_new_file.value);
    this.model.save_changes();      
  }
  private _onPftnameInputChanged() {
    const selectedInd = this._pftname.selectedIndex;
    // this._pftname.value = this._pftname.options[selectedInd].value;
    this._slatop.selectedIndex = selectedInd;
    this._flnr.selectedIndex = selectedInd;
    this._frootcn.selectedIndex = selectedInd;
    this._froot_leaf.selectedIndex = selectedInd;
    this._leafcn.selectedIndex = selectedInd;
  }
  private _onSlatopInputChanged() {
    this.model.set('slatop', this.options_to_array(this._slatop.options));
    this.model.save_changes();
  }
  private _onFlnrInputChanged() {
    this.model.set('flnr', this.options_to_array(this._flnr.options));
    this.model.save_changes();
  }
  private _onFrootCNInputChanged() {
    this.model.set('frootcn', this.options_to_array(this._frootcn.options));
    this.model.save_changes();
  }
  private _onFrootLeafInputChanged() {
    this.model.set('froot_leaf', this.options_to_array(this._froot_leaf.options));
    this.model.save_changes();
  }
  private _onLeafCNInputChanged() {
    this.model.set('leafcn', this.options_to_array(this._leafcn.options));
    console.log(this.model.get('leafcn'));
    this.model.save_changes();
  }
  private _onRmortInputChanged() {
    this.model.set('r_mort', this._r_mort.value);
    this.model.save_changes();
  }

  private options_to_array(options: HTMLOptionsCollection) {
    let arr_ret: number[] = [];

    if(options.length >= 1) {
        for (const index in options) {
            if (options[index] !== null && options[index].text !== null) {
                arr_ret.push(+options[index].text);
            }
        }
    }
    return arr_ret;
  }

  private _onsavebuttonClicked() {
    return (_event: Event): void => {
        console.log(this.model.get('saverequest'));
        this.model.set('saverequest', 'save');
        console.log(this.model.get('saverequest'));
        this.model.save_changes();
    };
  }
}