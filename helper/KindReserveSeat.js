class Kind_SeatReserve {
    NonPurchasable = 5; //black seat
    Purchasable = 1; // green seat
    Reserved = 3; // yellow seat for others
    Selected = 2; //blue seat for you
    Sold = 4;  // red seat
}


class Kind_SeatReserveClass {
     NonPurchasable = "blackchair"; //black seat
     Purchasable = "greenchair"; // green seat
     Reserved = "yellowchair"; // yellow seat for others
     Selected = "bluechair"; //blue seat for you
     Sold = "redchair";  // red seat
}


module.exports.Kind_SeatReserveClass = Kind_SeatReserveClass;
module.exports.Kind_SeatReserve = Kind_SeatReserve;