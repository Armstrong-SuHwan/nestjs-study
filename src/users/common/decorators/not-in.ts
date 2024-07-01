import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NotIn(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'NotIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(
          value: any,
          validationArguments?: ValidationArguments,
        ): Promise<boolean> | boolean {
          const [relatedProperty] = validationArguments.constraints;
          const relatedValue = (validationArguments.object as any)[
            relatedProperty
          ];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
