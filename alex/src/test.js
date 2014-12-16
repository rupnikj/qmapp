// Import libraries
var assert = require('assert.js');
var time = require('time');
var utilities = require('utilities.js');
var misc = require('misc');


function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return {
        grp: Object.keys(groups), 
        arr: Object.keys(groups).map(
            function (group) {
                return groups[group];
            }
        )}
    //return Object.keys(groups).map(function (group) {
    //    return groups[group];
    //})
}

strArr = fs.listFile('D:/work/data/amsterdam/quax_output/', 'rar', true);

var result = groupBy(strArr, function (item) {
    return item.substring(item.length - 24, item.length - 14);
});


var lines = fs.openRead('./darkside_processing/alexandre_filter.txt').readAll();
var keywords = lines.split('\r\n');
var searchVec = la.newStrVec(keywords);


var tw = qm.store("Tweets");
var mats = [];
for (var dayN = 0; dayN < result.grp.length; dayN++) {
    console.log(result.grp[dayN]);
    tw.clear();
    for (var rarN = 0; rarN < result.arr[dayN].length; rarN++) {
        qm.load.jsonFile(tw, result.arr[dayN][rarN]);
    }
    var rs = tw.recs;
    var timestamps = rs.getVec("Date");
    res = timestamps.sortPerm();
    rs.permute(res.perm);

    var dataVec = rs.getVec("Text");
    mats.push([misc.word_co(dataVec, searchVec)]);
    if (dayN > 5) { break }
}
catmats = la.cat(mats);

// row names and colnames print!
var colNames = searchVec;
var rowNames = la.newStrVec(result.grp);

eval(breakpoint);












//////strArr[0].substring(strArr[0].length - 24, strArr[0].length - 14)



////// group the files by day, load all, then clear


////exejs('count.js');
////eval(breakpoint)


////try {
////    exejs('graphs.js');
////} catch (e) {
////    console.log('error');
////}




////var rs = qm.search({ $from: "Tweets", Text: "occupy" });


////var regex = /(^|[^@\w])@(\w{1,15})\b/g;

////isRT = function (str) {
////    if (str.length > 3 && str[0] == 'r' && str[1] == 't' && str[2] == ' ') {
////        return true;
////    } else {
////        return false;
////    }
////}
//////rts = rs.map(function (rec) { return isRT(rec.Text); });
//////counter = 0; for (var i = 0; i < rts.length; i++) { if (rts[i]) counter++; }

////function descIdxMap(rs, getDescCallback) {
////    var map = utilities.newStrIntH();
////    var len = rs.length;
////    for (var i = 0; i < len; i++) {
////        var desc = getDescCallback(rs[i]);
////        if (!map.hasKey(desc)) {
////            map.put(desc, map.length);
////        }
////    }
////    return map;
////}


////map = descIdxMap(rs, function (rec) { return '@' + rec.author.Username; })



////if (qm.store("Edges") == null) {
////    var gstore = {
////        name: "Edges",
////        fields: [
////          { name: "source", type: "int" },
////          { name: "target", type: "int" },
////        ]
////    }
////    qm.createStore(gstore);
////}
////var edges = qm.store("Edges");

////function addEdges(rs, map, descExtractor, linkExtractor, edgeStore) {
////    for (var i = 0; i < rs.length; i++) {
////        if (i % 1000 == 0) { console.log(i); }
////        var user = descExtractor(rs[i]);
////        var sourceN = map.get(user);
////        var arr = linkExtractor(rs[i]);
////        if (arr != null) {
////            for (var j = 0; j < arr.length; j++) {
////                var targetN = map.get(arr[j]);
////                if (typeof targetN != 'undefined') {
////                    edgeStore.add({ source: sourceN, target: targetN })
////                }
////            }
////        }
////    }
////}

////if (edges.length == 0) {
////    addEdges(rs, map,
////    function (rec) { return '@' + rec.author.Username; },
////    function (rec) { return rec.Text.match(regex); },
////    edges);
////}

////// remap indices
////var map2 = utilities.newIntIntH();
////if (qm.store("Remapped") == null) {
////    var gstore = {
////        name: "Remapped",
////        fields: [
////          { name: "source", type: "int" },
////          { name: "target", type: "int" },
////        ]
////    }
////    qm.createStore(gstore);
////}
////console.log("remapping")
////var edges2 = qm.store("Remapped");
////if (edges2.length == 0) {
////    for (var i = 0; i < edges.length; i++) {
////        var nid1 = edges[i].source;
////        var nid2 = edges[i].target;
////        if (!map2.hasKey(nid1)) {            
////            map2.put(nid1, map2.length);
////        }
////        if (!map2.hasKey(nid2)) {
////            map2.put(nid2, map2.length);
////        }
////        edges2.add({ source: map2.get(nid1), target: map2.get(nid2) });
////    }
////}

////function buildGraph2(edgeStore) {
////    var G = snap.newDGraph();
////    // add edges
////    for (var i = 0; i < edgeStore.length; i++) {
////        nid1 = edgeStore[i].source;
////        nid2 = edgeStore[i].target;
////        if (!G.isNode(nid1)) { G.addNode(nid1); }
////        if (!G.isNode(nid2)) { G.addNode(nid2); }
////        G.addEdge(nid1, nid2);
////    }
////    return G;
////}

////G2 = buildGraph2(edges2);
//////G2.dump('rick2.graph');


////function write_adjlist(G, fnm) {
////    var fout = fs.openWrite(fnm);
////    var node = G.firstNode;
////    while (node.id != -1) {
////        // get outgoing links
////        if (node.outDeg > 0) {
////            fout.write(node.id + " ");
////            for (var i = 0; i < node.outDeg ; i++) {
////                fout.write(node.nbrId(i) + " ");
////            }
////            fout.write("\n");
////        }
////        node.next();
////    }
////    fout.close();
////}

////write_adjlist(G2, 'rick.adjlist');

////exejs('scripy.js');

////var dateCount = new strCount();
////rs.each(function (rec) { dateCount.add(rec.Date.dateString);})

////// create google annotated time line 

////var plotData = [];
////var ht = dateCount.ht;
////for (var i = 0; i < ht.length; i++) {
////    plotData.push([new Date(ht.key(i)), ht.dat(i)]);
////}
////vis.drawGoogleAnnotatedTimeLine(plotData, 'tesi.html');//, overrideParams

////function fracToIdx(frac, len) {
////    return Math.min(Math.floor(frac * len), len -1);
////}

////var cutFractions = la.newVec([0, 0.33, 0.66, 1.0]);
////for (var i = 0; i < cutFractions.length - 1; i++) {
////    var id1 = fracToIdx(cutFractions[i], rs.length);
////    var id2 = fracToIdx(cutFractions[i + 1], rs.length);
////    var frs = tw.newRecSet(la.rangeVec(id1, id2));


////}


////eval(breakpoint)



//// hash table: dateString count

//// function that reads a script and evals it


////function addEdge(G, nid1, nid2) {
////    if (!G.isNode(nid1)) { G.addNode(nid1); }
////    if (!G.isNode(nid2)) { G.addNode(nid2); }
////    G.addEdge(nid1, nid2);
////}

////function buildGraph(map, edgeStore) {
////    var G = snap.newUGraph();
////    // add nodes
////    for (var i = 0; i < map.length; i++) {
////        G.addNode(map.dat(i));
////    }
////    // add edges
////    for (var i = 0; i < edgeStore.length; i++) {
////        G.addEdge(edgeStore[i].source, edgeStore[i].target);
////    }
////    return G;
////}

////eval(breakpoint)

////G = buildGraph(map, edges);

////G.dump('rick.graph');

////function saveG(fileName, G) {
////    var fout = fs.openWrite(fileName);
////    var glen = G.length;
////    for (var i = 0; i < glen; i++) {
////        if (i % 1000 == 0) { console.say('fef ' + i) }
////        var keys = Object.keys(G[i]);
////        var ilen = keys.length;
////        for (var j = 0; j < ilen; j++) {
////            fout.write(keys[j]);
////            if (j < ilen - 1) { fout.write(','); }            
////        }
////        fout.write('\n');
////    }
////    fout.close();
////}

////saveG('rick.txt', G);

////eval(breakpoint);





//// graph






////// Load tweets from a file (toy example)
////// Set the filename
////var tweetsFile = "./sandbox/twitter/toytweets.txt";
////// Get the store
////var Tweets = qm.store("Tweets");
////// Load tweets (each line is a json)
////qm.load.jsonFile(Tweets, tweetsFile);
////// Print number of records
////console.say("number of records: " + Tweets.length);
////// Select all tweets
////var recSet = Tweets.recs;

////// Active learning settings: start svm when 2 positive and 2 negative examples are provided
////var nPos = 2; var nNeg = 2; //active learning query mode
////// Initial query for "relevant" documents
////var relevantQuery = "nice bad";
////// Initial query for positive sentiment
////var sentimentQuery = "nice";

////// Compute the feature space (if buildFtrSpace is false loads it from disk)
////var buildFtrSpace = true;
////// Learn a model that filters "relevant" documents (if learnSvmFilter is false, then the model is loaded from disk)
////var learnSvmFilter = true;
////// Learn a sentiment model (if learnSvmSentiment is false, then the model is loaded from disk)
////var learnSvmSentiment = true;

////// Load everything?
////var justLoad = false;
////if (justLoad) {
////    buildFtrSpace = false;
////    learnSvmFilter = false;
////    learnSvmSentiment = false;
////}
////// The feature space provides the mapping from documents (tweets) to sparse vectors (provided by linear algebra module)
////// Create or load feature space
////var ftrSpace = analytics.newFeatureSpace([
////	{ type: "text", source: "Tweets", field: "Text" },
////]);
////if (buildFtrSpace) {
////    // Builds a new feature space
////    ftrSpace.updateRecords(recSet);
////    // Saves the feature space
////    var fout = fs.openWrite("./sandbox/twitter/fs.dat");
////    ftrSpace.save(fout);
////    fout.close();
////} else {
////    // Load the feature space
////    var fin = fs.openRead("./sandbox/twitter/fs.dat");
////    ftrSpace = analytics.loadFeatureSpace(fin);
////}


////// Learn a model of relevant tweets 
////if (learnSvmFilter) {
////    // Constructs the active learner
////    var AL = new analytics.activeLearner(ftrSpace, "Text", recSet, nPos, nNeg, relevantQuery);
////    // Starts the active learner (use the keyword stop to quit)
////    AL.startLoop();
////    // Save the model
////    var fout = fs.openWrite('./sandbox/twitter/svmFilter.bin');
////    AL.saveSvmModel(fout);
////    fout.close();
////}
////// Load the model from disk
////var fin = fs.openRead("./sandbox/twitter/svmFilter.bin");
////var svmFilter = analytics.loadSvmModel(fin);
////// Filter relevant records: records are dropped if svmFilter predicts a v negative value (anonymous function)
////recSet.filter(function (rec) { return svmFilter.predict(ftrSpace.ftrSpVec(rec)) > 0; });

////// Learn a sentiment model 
////if (learnSvmSentiment) {
////    // Constructs the active learner
////    var AL = new analytics.activeLearner(ftrSpace, "Text", recSet, nPos, nNeg, sentimentQuery);
////    // Starts the active learner
////    AL.startLoop();
////    // Saves the sentiment model
////    var fout = fs.openWrite('./sandbox/twitter/svmSentiment.bin');
////    AL.saveSvmModel(fout);
////    fout.close();
////}
////// Loads the sentiment model
////var fin = fs.openRead('./sandbox/twitter/svmSentiment.bin');
////var svmSentiment = analytics.loadSvmModel(fin);

////// Classify the sentiment of the "relevant" tweets
////for (var recN = 0; recN < recSet.length; recN++) {
////    recSet[recN].Sentiment = svmSentiment.predict(ftrSpace.ftrSpVec(recSet[recN])) > 0 ? 1 : -1;
////}

////// Filter the record set of by time
////// Clone the rec set two times
////var recSet1 = recSet.clone();
////var recSet2 = recSet.clone();
////// Set the cutoff date
////var tm = time.parse("2011-08-01T00:05:06");
////// Get a record set with tweets older than tm
////recSet1.filter(function (rec) { return rec.Date.timestamp < tm.timestamp })
////// Get a record set with tweets newer than tm
////recSet2.filter(function (rec) { return rec.Date.timestamp > tm.timestamp })
////// Print the record set length
////console.say("recSet1.length: " + recSet1.length + ", recSet2.length: " + recSet2.length);
////// Build two communication graph snapshots based on the two record sets. Users represent graph nodes. A user "a" is linked to user "b" if "a" authored a tweet that contained the keyword @"b".
////// Each node is assigned a sentiment (majority sentiment based on all the tweets authored by the node)
////// Build the first graph and save it in DOT format (implemented in C++ as a qminer aggregate)
////var u1 = recSet1.aggr({ name: "tgraph1", dotName: "tesi1", type: "twitterGraph", fName: "./sandbox/twitter/graph1.gv" });
////// Build the second graph (based on the second record set) and filter the nodes that were not present in the first graph, finally save it in DOT format
////var u2 = recSet2.aggr({ name: "tgraph2", dotName: "tesi2", type: "twitterGraph", fName: "./sandbox/twitter/graph2.gv", userVec: u1 });
////// Start console
////console.say("Interactive mode: empty line to release");
////console.start();


////function buildGraph(rs, map, descExtractor, linkExtractor) {
////    var G = snap.newUGraph();
////    for (var i = 0; i < rs.length; i++) {
////        if (i % 1000 == 0) { console.log(i); }
////        var user = descExtractor(rs[i]);
////        var sourceN = map.get(user);
////        var arr = linkExtractor(rs[i]);
////        if (arr != null) {
////            for (var j = 0; j < arr.length; j++) {
////                var targetN = map.get(arr[j]);
////                if (typeof targetN != 'undefined') {
////                    addEdge(G, sourceN, targetN);
////                }
////            }
////        }
////    }
////    return G;
////}
