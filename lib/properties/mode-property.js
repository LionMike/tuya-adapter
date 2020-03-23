'use strict';

const Property = require('gateway-addon').Property;

class ModeProperty extends Property {
  constructor(device, dps, modes, modestxt, setcb, updatecb) {
    super(device, 'mode', {
      label: 'Mode',
      type: 'string',
      enum: modestxt?modestxt:modes,
      value: '',
    });
    this.dps = dps;
    this.modes = modes;
    this.modestxt = modestxt;
    this.setcb = setcb;
    this.updatecb = updatecb;
  }

  update(value) {
    if (this.modestxt)
      this.setCachedValueAndNotify(this.modestxt[this.modes.indexOf(value)]);
    else
      this.setCachedValueAndNotify(value);
    if (this.updatecb) this.updatecb(value);
  }

  setValue(value) {
    return new Promise(((resolve, reject) => {
      super.setValue(value).then((updatedValue) => {
        if (this.dps) {
          if (this.modestxt)
            this.device.tuyapi.set({dps: this.dps, set: this.modes[this.modestxt.indexOf(value)]});
          else
            this.device.tuyapi.set({dps: this.dps, set: value});
        }
        if (this.setcb) this.setcb(value);
        resolve(updatedValue);
      }).catch((err) => {
        reject(err);
      });
    }).bind(this));
  }
}

module.exports = ModeProperty;