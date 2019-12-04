const Kind_SeatReserve = {

    NonPurchasable: 5, //black seat
    Purchasable: 1, // green seat
    Reserved: 3, // yellow seat for others
    Selected: 2, //blue seat for you
    Sold: 4  // red seat

}


const Kind_SeatReserveClass = {
    NonPurchasable: "blackchair", //black seat
    Purchasable: "greenchair", // green seat
    Reserved: "yellowchair", // yellow seat for others
    Selected: "bluechair", //blue seat for you
    Sold: "redchair"  // red seat

}


function getSeatClass (seatStatCODE) {

    switch (seatStatCODE) {
        case Kind_SeatReserve.NonPurchasable:
            return Kind_SeatReserveClass.NonPurchasable;
        case Kind_SeatReserve.Purchasable:
            return Kind_SeatReserveClass.Purchasable;
        case Kind_SeatReserve.Reserved:
            return Kind_SeatReserveClass.Reserved;
        case Kind_SeatReserve.Selected:
            return Kind_SeatReserveClass.Selected;
        case Kind_SeatReserve.Sold:
            return Kind_SeatReserveClass.Sold;
        default:
            return Kind_SeatReserveClass.Purchasable;
    }

}

module.exports.Kind_SeatReserve = Kind_SeatReserve;
module.exports.Kind_SeatReserveClass = Kind_SeatReserveClass;
module.exports.getSeatClass = getSeatClass;