import { netLuckyWheelDraw, netLuckyWheelListRewards } from "../net/LuckWheelNet";

export function luckyWheelListRewards( callback ) {
    return ( dispatch ) => {
        netLuckyWheelListRewards( ( err, resBody ) => {
            callback( err, resBody );
        } )
    };
}

export function luckyWheelDraw( callback ) {
    return ( dispatch ) => {
        netLuckyWheelDraw( ( err, resBody ) => {
            callback( err, resBody );
        } )
    };
}
