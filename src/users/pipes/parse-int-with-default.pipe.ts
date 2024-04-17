import { PipeTransform } from "@nestjs/common";

export class ParseIntWithDefault implements PipeTransform<string, number> {
  constructor(private readonly defaultValue: number) {}
  transform(value?: string) {
    const intValue = parseInt(value, 10);
    return isNaN(intValue) || intValue < 1 ? this.defaultValue : intValue;
  }
}
