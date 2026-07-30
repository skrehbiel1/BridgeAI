import { Partnership } from "./Partnership";
import { Trick } from "../play/Trick";

export class Table {
  currentTrick = new Trick();

  nsTricks = 0;
  ewTricks = 0;

  awardTrick(
    partnership: Partnership
  ): void {
    if (
      partnership ===
      Partnership.NS
    ) {
      this.nsTricks++;
    } else {
      this.ewTricks++;
    }
  }

  totalTricks(): number {
    return (
      this.nsTricks +
      this.ewTricks
    );
  }
}