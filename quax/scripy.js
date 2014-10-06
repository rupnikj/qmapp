var utilities = require('utilities.js');
function strCount() {
    this.ht = utilities.newStrIntH();

    this.add = function (key) {
        if (this.ht.hasKey(key)) {
            var val = this.ht.get(key);
            this.ht.put(key, val + 1);
        } else {
            this.ht.put(key, 1);
        }
    }
}

var printHash = function (ht) {
    for (var i = 0; i < ht.length; i++) {
        console.println(ht.key(i) + ": " + ht.dat(i));
    }
}

var tes = new strCount();
tes.add('lla');
tes.add('lla');
tes.add('llaa');
tes.add('lla');
tes.add('llaa');
tes.add('llaaa');

printHash(tes.ht);