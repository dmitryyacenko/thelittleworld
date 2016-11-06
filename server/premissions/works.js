Works.allow({
        'insert': (uID, doc)=>!!uID,
        'update': (uID, doc)=>!!uID,
        'remove': (uID, doc)=>!!uID
});