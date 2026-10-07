function CTreeDecision(oObj){
    
    var _aNode;
    
    var _oTree;
    var _oRoot;
    
    
    
    this._init = function(oObj){
        _aNode = new Array();
        for(var i=0; i<SEARCH_DEPTH+1; i++){
            _aNode[i] = new Array();
        }
        
        _oTree = new TreeModel();        
        _oRoot = _oTree.parse(oObj);
        
        _aNode[0][0] = _oRoot;
    };
    
    this.getRoot = function(){
       return(_oRoot);
    };
    
    this.initNewNode = function(iDepth){
        // Parse the new node
        _aNode[iDepth].push( _oTree.parse({rating:0, moves:[], depth:iDepth}) );

        return _aNode[iDepth][_aNode[iDepth].length-1];
    };
    
    this.addNode = function(iParentRow, iRate, aMove){
        var iChildRow = iParentRow+1;
        var iChildCol = _aNode[iChildRow].length-1;
        
        _aNode[iChildRow][iChildCol].model.moves = aMove;
        _aNode[iChildRow][iChildCol].model.rating = iRate;


        // Add node to the parent
        var iParentCol = _aNode[iParentRow].length-1;

        _aNode[iParentRow][iParentCol].addChild(_aNode[iChildRow][iChildCol]);
    };
    
    this.rateNode = function(oNode, iRate){
        oNode.model.rating = iRate;
    };
    
    this.getNode = function(iRate, iDepth){
        return (
            _oRoot.all(function (node) {
                return node.model.rating === iRate && node.model.depth === iDepth;
            })
        );        
    };
    
    this.getPath = function(oNode){
        return oNode.getPath();
    };
    
    this.getTerminalNodes = function(){
        return(
            _oRoot.all(function (node) {
                return !node.hasChildren();
            })
        );        
    };
    
    this._init(oObj);
}