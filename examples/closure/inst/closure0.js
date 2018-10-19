function runClosures() {
    function Cow(lungCapacity) {
        var $fsm3 = $fsm.create(arguments);
        this.$fsm_index = [
            3,
            $fsm3.$ref_index
        ];
        $fsm3.$scopes.$fsm3 = $fsm3.$ref_index;
        $fsm3.lungCapacity = lungCapacity;
        $fsm3.airInLungs = 0;
        $fsm3.breathe = function breathe() {
            $fsm3.airInLungs = $fsm3.lungCapacity;
        };
        $fsm3.getAirInLungs = function getAirInLungs() {
            return $fsm3.airInLungs;
        };
        $fsm3.moo = function moo() {
            let output = 'm';
            let air = $fsm3.getAirInLungs();
            while (air-- > 0) {
                output += 'o';
            }
            $fsm3.airInLungs = air;
            return output;
        };
        return {
            breathe: $fsm3.breathe,
            moo: $fsm3.moo
        };
    }
    const herd = [];
    for (var i = 0; i < 30000; i++) {
        const cow = Cow(i);
        cow.index = i;
        herd.push(cow);
    }
    const start = Date.now();
    herd.map(function (cow) {
        cow.breathe();
        cow.moo();
    });
    console.log('CLOSURES: Finished mooing in ' + (Date.now() - start) / 1000 + ' seconds');
}
runClosures();