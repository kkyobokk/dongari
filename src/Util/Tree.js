class Node {
    constructor(data, id){
        this.id = (id !== undefined) ? id : Number(new Date());
        this.info = data;
        this.children = [];
        this.parent = null;
        this.depth = 0;
    }

    getId(){return this.id;}
    getInfo(){return this.info;}
    getChildren(){return this.children;}
    getParent(){return this.parent;}
    getDepth(){return this.depth;}
    merge(key, val){
        this[key] = val;
        return this;
    }
    getPedigree(){
        const ret = [];
        const func = (e, ret) => {
            ret.push(e);
            ret.push(...e.getChildren().filter(e => !ret.includes(e)).reduce((a,e) => {
                if(e.getChildren().length > 0) { func(e, ret); return a; }
                else return [...a, e];
            }, []));
        }
        func(this, ret);
        return ret;
    }
    copy(){
        const ret = new Node(this.getId(), this.getInfo());
        const tree = new Tree(ret);
        const func = (CopyingNode, CopiedNode) => {
            CopyingNode.getChildren().forEach(e => {
                const addNode = new Node(e.getId(), e.getInfo());
                tree.addChild(CopiedNode, addNode);
                func(e, addNode);
            })
        }
        func(this, ret);
        return ret;
    }
}

class Tree {
    constructor(Root){
        this.Root = Root;
        this.nodes = [Root];
    }
    getRoot(){return this.Root;}
    getNodebyId(id){return this.nodes.find(e => e.getId() === id);}
    getNodes(){return this.nodes;}
    addChild(node1, node2){
        if(node1.getChildren().includes(node2)) return null;
        this.nodes.push(node2);
        node2.merge("parent", node1);
        node2.merge("depth", node1.getDepth()+1);
        node1.merge("children", [...node1.getChildren(), node2]);
        return node2;
    }
    addChildatRoot(node) {
        node.depth = 1;
        node.parent = this.Root;
        this.Root.children.push(node);
        this.nodes.push(...node.getPedigree());

        return node;
    }

    removeChild(node1, node2){
        node2.parent = null;
        node2.depth = undefined;
        node1.children = node1.children.filter(e => e.getId() !== node2.getId());
        this.nodes = this.nodes.filter(e => e.getId() !== node2.getId())
    }

    exchangeChild(node1, node2){
        if(!(node1 instanceof Node && node2 instanceof Node)) return 0;
        if(node1.getParent() !== null) node1.getParent().merge('children', node1.getParent().getChildren().map((e,i,a) => {return i === a.indexOf(node1) ? node2 : e}));
        node2.merge('parent', node1.getParent());
        node2.getPedigree().forEach(e => e.merge('depth', e.getDepth() + node1.getDepth()))
        
        const deleting = node1.getPedigree();
        const adding = node2.getPedigree();
        if(node1 === this.getRoot()) this.Root = node2;

        this.nodes = this.nodes.filter(e => !deleting.includes(e)).concat(adding);

        return node2;
    }

    getMaxDepth(){return Math.max(this.getNodes().map(e => e.getDept()));}
    
    getLeafNodes(){return this.getNodes().filter(e => !e.getChildren().length)}
}

export { Node, Tree };