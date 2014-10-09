var keywords = ["elections", "higgs", "obamacare", "occupy", "sandy", "sopa"];
//10.4, 10.14, 10.24, 11.11, 11.30
var keyw = "occupy";
var rs = qm.search({ $from: "Tweets", Text: keyw});

var regex = /(^|[^@\w])@(\w{1,15})\b/g;

function descIdxMap(rs, getDescCallback) {
    var map = utilities.newStrIntH();
    var len = rs.length;
    for (var i = 0; i < len; i++) {
        var desc = getDescCallback(rs[i]);
        if (!map.hasKey(desc)) {
            map.put(desc, map.length);
        }
    }
    return map;
}

function addEdges(rs, map, descExtractor, linkExtractor, dateExtractor, kw, edgeStore) {
    for (var i = 0; i < rs.length; i++) {
        if (i % 1000 == 0) { console.log(i); }
        var user = descExtractor(rs[i]);
        var sourceN = map.get(user);
        var arr = linkExtractor(rs[i]);
        if (arr != null) {
            for (var j = 0; j < arr.length; j++) {
                var targetN = map.get(arr[j]);
                if (typeof targetN != 'undefined') {
                    edgeStore.add({ source: sourceN, target: targetN, timestamp: dateExtractor(rs[i]), keyword: kw})
                }
            }
        }
    }
}

function buildDGraph(edgers) {
    var G = snap.newDGraph();
    // add edges
    for (var i = 0; i < edgers.length; i++) {
        nid1 = edgers[i].source;
        nid2 = edgers[i].target;
        if (!G.isNode(nid1)) { G.addNode(nid1); }
        if (!G.isNode(nid2)) { G.addNode(nid2); }
        G.addEdge(nid1, nid2);
    }
    return G;
}

function write_adjlist(G, fnm) {
    var fout = fs.openWrite(fnm);
    var node = G.firstNode;
    while (node.id != -1) {
        // get outgoing links
        if (node.outDeg > 0) {
            fout.write(node.id + " ");
            for (var i = 0; i < node.outDeg ; i++) {
                fout.write(node.nbrId(i) + " ");
            }
            fout.write("\n");
        }
        node.next();
    }
    fout.close();
}

if (qm.store("Edges") == null) {
    var gstore = {
        name: "Edges",
        fields: [
            { name: "keyword", type: "string" },
            { name: "source", type: "int" },
            { name: "target", type: "int" },
            { name: "timestamp", type: "float" }
        ],
        keys: [
            { field: "keyword", type: "value" }
        ]
    }
    qm.createStore(gstore);
}
var edges = qm.store("Edges");

console.log('building map');
map = descIdxMap(rs, function (rec) { return '@' + rec.author.Username; });

if (edges.length == 0) {
    console.log('filling edge store');
    addEdges(rs, map,
    function (rec) { return '@' + rec.author.Username; },
    function (rec) { return rec.Text.match(regex); },
    function (rec) { return rec.Date.timestamp; },
    keyw,
    edges);
}

console.log('building graph');
G = buildDGraph(edges.recs);
console.log('saving graph');
write_adjlist(G, 'graph.adjlist');
console.log('done');

//sequence of dates
var cutDates = ["2011-08-01", "2011-10-4", "2011-10-14", "2011-10-24", "2011-11-11", "2011-11-30"];
var cutTimestamps = cutDates.map(function (arg) { return time.parse(arg).timestamp; })

function diffBucket(t1, t2, tarr) {
    for (var i = 0; i < tarr.length; i++) {
        if ((tarr[i] - t1) * (tarr[i] - t2) < 0) {
            return true;
        }
        // assumption that tarr is increasing
        if (tarr[i] > t1 && tarr[i > t2]) {
            break;
        }
    }
    return false;
}

//time.fromUnixTimestamp(edgeArr[5][0].timestamp).string
var edgeArr = edges.recs.split(function (rec, rec2) { return diffBucket(rec.timestamp, rec2.timestamp, cutTimestamps) });
for (var i = 0; i < edgeArr.length; i++) {
    var G = buildDGraph(edgeArr[i]);
    write_adjlist(G, edgeArr[i][0].keyword + '_' + time.fromUnixTimestamp(edgeArr[i][0].timestamp).dateString + '_' + time.fromUnixTimestamp(edgeArr[i][edgeArr[i].length -1].timestamp).dateString + '.txt');
}