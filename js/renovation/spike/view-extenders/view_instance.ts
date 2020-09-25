/* eslint-disable class-methods-use-this */
import GridModules from '../../../ui/grid_core/ui.grid_core.modules';

export class RenovatedViewInstance extends GridModules.View {
  constructor(component) {
    super(component);
    console.log('View created');
  }

  // TODO fix editing core it try to disable editing item before header-panel-view will be creeated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setToolbarItemDisabled(itemName: string, disabled: boolean): void { }
}
