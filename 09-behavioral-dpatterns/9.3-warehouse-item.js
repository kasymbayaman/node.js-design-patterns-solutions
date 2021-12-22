
const itemState = {
  arriving: 'arriving',
  stored: 'stored',
  delivered: 'delivered',
}

//==================== Strategies ===============
class ItemStrategy {
  constructor(wareHouseItem) {
    this.wareHouseItem = wareHouseItem;
  }
}

class StoredItemStrategy extends ItemStrategy {
  validateNewStatus = (status) => status === itemState.delivered;
  describeItem = () => `Item ${this.wareHouseItem.id} is stored in ${this.wareHouseItem.locationId}.`;
}

class ArrivingItemStrategy extends ItemStrategy {
  validateNewStatus = (status) => status === itemState.stored;
  describeItem = () => `Item ${this.wareHouseItem.id} is on its way to the warehouse`;
}

class DeliveredItemStrategy extends ItemStrategy {
  validateNewStatus = (status) => false; // it's final status
  describeItem = () => `Item ${this.wareHouseItem.id} was delivered to ${this.wareHouseItem.address}.`
}


// ======================= Context WarehouseItem ==========
class WarehouseItem {
  constructor(id, state) {
    this._state = state;
    this.id = id;
    this.updateStrategy();
  }

  updateStrategy() {
    switch (this._state) {
      case itemState.arriving:
        this._strategy = new ArrivingItemStrategy(this);
        return;
      case itemState.stored:
        this._strategy = new StoredItemStrategy(this);
        return;
      case itemState.delivered:
        this._strategy = new DeliveredItemStrategy(this);
        return;
      default:
        throw new Error('Invalid state:', this._state);
    }
  }

  store(locationId) {
    const newStatus = itemState.stored;
    const isValidNewStatus = this._strategy.validateNewStatus(newStatus);
    if (!isValidNewStatus) {
      throw Error(`Status cannot be updated from ${this._state} to ${newStatus}`)
    }

    this._state = itemState.stored;
    this.updateStrategy();
    this.locationId = locationId;
  }

  deliver(address) {
    const newStatus = itemState.delivered;
    const isValidNewStatus = this._strategy.validateNewStatus(newStatus);
    if (!isValidNewStatus) {
      throw Error(`Status cannot be updated from ${this._state} to ${newStatus}`)
    }

    this._state = itemState.delivered;
    this.updateStrategy();
    this.address = address;
    this.locationId = null;
  }

  describe() {
    return this._strategy.describeItem();
  }
}

const item1 = new WarehouseItem(1, itemState.arriving);

console.log(item1.describe());
item1.store('Lenin Avenue 23, warehouse N12');
console.log(item1.describe());

item1.deliver('Nesky Avenue 233, flat 34');
console.log(item1.describe());

item1.store(); // throws an error