import Component from '../../../core/component';
import DomComponent from '../../../core/dom_component';
// import Widget from '../../../ui/widget/ui.widget';


const { _getSynchronizableOptionsForCreateComponent, _createComponent, _extendConfig } = DomComponent.prototype;


export class DataGridComponent extends Component {

    setElement($element) {
        this.$elementValue = $element;
    }

    // eslint-disable-next-line react/sort-comp
    $element() {
        return this.$elementValue;
    }
}

DataGridComponent.prototype._getSynchronizableOptionsForCreateComponent = _getSynchronizableOptionsForCreateComponent;
DataGridComponent.prototype._createComponent = _createComponent;
DataGridComponent.prototype._extendConfig = _extendConfig;
// GridComponent.prototype.setAria = Widget.prototype.setAria;
