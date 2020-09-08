import Component from '../../../core/component';
import DomComponent from '../../../core/dom_component';
// not work element needed
// import Widget from '../../../ui/widget/ui.widget';
import gridCore from '../../../ui/data_grid/ui.data_grid.core';
import { isFunction } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';

const { _getSynchronizableOptionsForCreateComponent, _createComponent, _extendConfig, _getDefaultOptions,
    _getAnonymousTemplateName, _initTemplateManager, _getTemplateByOption, _initTemplates, _getTemplate, _saveTemplate, _useTemplates } = DomComponent.prototype;


export class DataGridComponent extends Component /* not work element needed DomComponent*/ {
    _getDefaultOptions() {
        const result = this.__getDefaultOptions();
        gridCore.modules.forEach((m) => {
            if(isFunction(m.defaultOptions)) {
                extend(true, result, m.defaultOptions());
            }
        });
        return result;
    }

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
DataGridComponent.prototype.__getDefaultOptions = _getDefaultOptions;
DataGridComponent.prototype._getAnonymousTemplateName = _getAnonymousTemplateName;
DataGridComponent.prototype._initTemplateManager = _initTemplateManager;
DataGridComponent.prototype._getTemplateByOption = _getTemplateByOption;
DataGridComponent.prototype._initTemplates = _initTemplates;
DataGridComponent.prototype._getTemplate = _getTemplate;
DataGridComponent.prototype._saveTemplate = _saveTemplate;
DataGridComponent.prototype._useTemplates = _useTemplates;
// GridComponent.prototype.setAria = Widget.prototype.setAria;
