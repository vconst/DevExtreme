export class Placeholder {
  private readonly componentTypes: any[] = [];

  constructor(defaultComponentType) {
    this.componentTypes = [defaultComponentType];
  }

  register(componentType): void {
    this.componentTypes.unshift(componentType);
  }

  getComponentTypes() {
    return this.componentTypes;
  }
}
