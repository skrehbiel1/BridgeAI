import { Auction } from "./Auction";
import { Bid } from "./Bid";
import { Suit } from "../cards/Card";

import { Seat } from "../core/Seat";

const auction = new Auction(
    Seat.North
);


auction.addBid(
    Bid.Contract(1,Suit.Spades)
);


auction.addBid(
    Bid.Pass()
);


auction.addBid(
    Bid.Pass()
);
	

auction.addBid(
    Bid.Pass()
);


console.log(
    auction.isComplete()
);

console.log(
    auction.lastContract()
        ?.toString()
);