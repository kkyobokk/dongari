import './App.css';
import { useEffect, useState, use } from 'react';
import { Node, Tree } from './Util/Tree.js';

function App() {
  const [contents, setContents] = useState("");
  const [UnReTree, setUnReTree] = useState(new Tree(new Node("", 'header')));
  const [point, setPoint] = useState(UnReTree.getRoot());
  const [isBs, setIsBs] = useState(false);
  const [lock, setLock] = useState(false);

  const change = e => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;

    if(lock) {
      setLock(false);
      return;
    }
    setContents(e.target.value);

    if(isBs){
      setPoint(UnReTree.addChild(point, new Node({
        char : "Backspace",
        index : start 
      })))
      setIsBs(false);
      return;
    }

    setPoint(UnReTree.addChild(point, new Node({
      char : e.target.value.substring(start-1, start),
      index : start-1
    }, point.getChildren().length)));
    console.log(e.target.value.substring(start-1, start));
    //e.target.setSelectionRange(start-1, start-1);
  };

  const keyDown = e => {
    console.log(e.target.selectionStart, e.target.selectionEnd, e.key);
    e.target.selectionStart !== e.target.selectionEnd && setLock(true);
    e.key === 'Backspace' && e.target.selectionStart > 0 && setIsBs(true);

    if(e.ctrlKey){
      e.preventDefault();
      const ret = [];
      const func = node => {
        if(node === null) return;
        ret.push(node.getInfo());
        node.getParent() !== null && node.getParent().getInfo() !== "" && func(node.getParent());
      };

      const combine = ret => ret.reverse().reduce((a,e) => {
        e.char !== 'Backspace' ?
        a.splice(e.index, 0, e.char)
        : a.splice(e.index, 1);
        return a
      }, []).join("");

      if(e.key === 'x'){
        if(!point.getChildren().length) return;
        func(point.getChildren()[0]);

        setContents(combine(ret));
        setPoint(point.getChildren()[0]);
        return;
      }
      else if(e.key === 'z'){
        if(point.getParent() === null) return;
        func(point.getParent());
        
        setContents(combine(ret));
        return;
      }
      else if(e.key === 'ArrowRight') {
        const node = point.getParent().getChildren()[(point.getId()+1) % point.getParent().getChildren().length];
        console.log(node, (point.getId()+1) % point.getParent().getChildren().length);
        func(node);

        setContents(combine(ret));
        setPoint(node)
      }
    }
  }

  useEffect(() => {
    console.log(UnReTree, point);
  }, [point]);


  return (
    <div className="HIGH">
      <textarea className="text"
      onChange={change}
      onKeyDown={keyDown}
      value = {contents}
      />
      
      <div id="ac"> All Case </div>
      {
        UnReTree.getLeafNodes().map(e => {
          const ret = [];
          const func = node => {
            if(node === null) return;
            ret.push(node.getInfo());
            node.getParent() !== null && node.getParent().getInfo() !== "" && func(node.getParent());
          };
          
          const combine = ret => ret.reverse().reduce((a,e) => {
            e.char !== 'Backspace' ?
            a.splice(e.index, 0, e.char)
            : a.splice(e.index, 1);
            return a
          }, []).join("");

          func(e);

          return (
            <div> {combine(ret)} </div>
          )
        })
      }
    </div>
  );
}

export default App;