import { Injectable } from '@angular/core';

@Injectable()
export class Utilities {
  public static toTitleCase(text: string) {
    return text.replace(/\w\S*/g, (subString) => {
      return (
        subString.charAt(0).toUpperCase() + subString.substring(1).toLowerCase()
      );
    });
  }
  public static splitInTwo(
    text: string,
    separator: string,
    splitFromEnd = false
  ): { firstPart: string; secondPart: string | undefined } {
    let separatorIndex = -1;

    if (separator !== '') {
      if (!splitFromEnd) separatorIndex = text.indexOf(separator);
      else separatorIndex = text.lastIndexOf(separator);
    }

    if (separatorIndex === -1) {
      return { firstPart: text, secondPart: undefined };
    }

    const part1 = text.substring(0, separatorIndex).trim();
    const part2 = text.substring(separatorIndex + 1).trim();

    return { firstPart: part1, secondPart: part2 };
  }
}
