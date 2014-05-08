define(["./frame"], function (Frame) {
    "use strict";

    /**
     * Constructs a new Graph
     * @constructor
     * @alias Graph
     *
     * @param {Object} props - Object containing optional properties of the Graph
     * @param {Boolean} props.antialias - 'true' if antialiasing should be enabled on the graph. Defaults to 'false'.
     * @param {Boolean} props.sizeAttenuation - 'true' if nodes' size should change with distance. Defaults to 'false'.
     * @param {String} props.nodeImage - Path to an image to use for the graph nodes, defaults to no image.
     * @param {Boolean} props.nodeImageTransparent - 'true' if the node image has transparency, defaults to 'false'.
     * @param {Number} props.nodeSize - Number representing the size (in pixels) of the nodes within the graph, defaults to 10
     * @param {Number} props.edgeOpacity - Number (between 0 and 1) indicating the percentage opacity of the edges, defaults to 1 (100%)
     * @param {Number} props.edgeWidth - Number representing the width (in pixels) of the edges within the graph, defaults to 1
     * @param {Number|String} props.bgColor - Hexadecimal or CSS-style string representation the color of the background, defaults to 'white'
     * @param {Number} props.bgOpacity - Number (between 0 and 1) indicating the percentage opacity of the background, defaults to 1 (100%)
     */
    var Graph = function (props) {
        this._nodeIds = {};
        this._nodes = [];
        this._edges = [];
        this._initProps(props);
    };

    Graph.prototype._initProps = function (properties) {
        properties = properties || {};

        this._antialias = !!properties.antialias;

        this._sizeAttenuation = !!properties.sizeAttenuation;

        this._nodeImage = properties.nodeImage || undefined;

        this._nodeImageTransparent = !!properties.nodeImageTransparent;

        this._nodeSize = properties.nodeSize !== undefined ? properties.nodeSize : 10;

        this._bgColor = properties.bgColor !== undefined ? properties.bgColor : "white";

        this._bgOpacity = properties.bgOpacity !== undefined ? properties.bgOpacity : 1;

        this._edgeWidth = properties.edgeWidth !== undefined ? properties.edgeWidth : 1;

        this._edgeOpacity = properties.edgeOpacity !== undefined ? properties.edgeOpacity : 1;

        return this;
    };

    Graph.prototype.addNode = function (node) {
        var id = node.getId();

        if (id !== undefined) {
            this._nodeIds[id] = node;
        }

        this._nodes.push(node);

        return this;
    };

    Graph.prototype.getNode = function (id) {
        return this._nodeIds[id];
    };

    Graph.prototype.getNodes = function () {
        return this._nodes;
    };

    Graph.prototype.getEdges = function () {
        return this._edges;
    };

    /**
     * Add an Edge to the Graph. Upon adding, if the Edge contains Node string ID's, they will be looked up in the Graph and replaced with Node instances.
     */
    Graph.prototype.addEdge = function (edge) {
        this._resolveEdgeIds(edge);
        this._edges.push(edge);

        return this;
    };

    /**
     * Replace string IDs representing Nodes in Edges with Node references
     * @private
     *
     * @param {Edge} edge - Edge that
     * @returns {undefined}
     */
    Graph.prototype._resolveEdgeIds = function (edge) {
        var node, nodes = edge.getNodes(), type;

        type = typeof nodes[0];
        if (type === "string" || type === "number") {
            node = this.getNode(nodes[0]);
            if (node === undefined) {
                throw "Could not resolve id=" + nodes[0];
            }
            nodes[0] = node;
        }

        type = typeof nodes[1];
        if (type === "string" || type === "number") {
            node = this.getNode(nodes[1]);
            if (node === undefined) {
                throw "Could not resolve id=" + nodes[1];
            }
            nodes[1] = node;
        }
    };

    Graph.prototype.renderIn = function (elem) {
        return new Frame(elem, this);
    };

    return Graph;
});
