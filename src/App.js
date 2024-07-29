import './App.css';
import { useEffect, useState, useCallback } from 'react';
import { Node, Tree } from './Util/Tree.js';

function App() {
  const [contents, setContents] = useState("");
  const [UnReTree] = useState(new Tree(new Node("", 'header')));
  const [point, setPoint] = useState(UnReTree.getRoot());
  const [isBs, setIsBs] = useState(false);
  const [lock, setLock] = useState(false);

  const change = useCallback(e => {
    const start = e.target.selectionStart;
    
    if(lock || /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.target.value.substring(start-1, start))) {
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

    const char = e.target.value.substring(start-1, start);

    setPoint(
      point.getChildren().map(e => e.getInfo().char).includes(char) ?
      point.getChildren().find(e => e.getInfo().char === char)
      :
      UnReTree.addChild(point, new Node({
        char : char,
        index : start-1
      }, point.getChildren().length))
    );
  }, [point, lock, isBs]);

  const keyDown = useCallback(e => {
    const start = e.target.selectionStart;
    console.log(start, e.target.selectionEnd, e.key, e.key === 'Process');
    (start !== e.target.selectionEnd || e.key === 'Process') && setLock(true);
    e.key === 'Backspace' && start > 0 && setIsBs(true);

    if(e.ctrlKey){
      e.preventDefault();
      const ret = [];

      const func = node => {
        ret.push(node.getInfo());
        node.getParent() !== null && node.getParent().getInfo() !== "" && func(node.getParent());
      };

      const combine = ret => ret.reverse().reduce((a,e) => {
        e.char !== 'Backspace' ?
        a.splice(e.index, 0, e.char)
        : a.splice(e.index, 1);
        return a
      }, []).join("");

      const settingContents = node => {
        if(!node) return;
        func(node);
        setContents(combine(ret));
        setPoint(node);
      }

      switch(e.key) {
        case 'r' :
          window.location.reload();
          break;
        case 'x' :
          settingContents(point.getChildren()[0]);
          break;
        case 'z' :
          settingContents(point.getParent());
          break;
        case 'ArrowRight' :
          settingContents(point.getParent().getChildren()[(point.getId()+1) % point.getParent().getChildren().length]);
          break;
        case 'ArrowLeft' :
          settingContents(point.getParent().getChildren().at((point.getId()-1) % point.getParent().getChildren().length));
          break;
        default :
          break;
      }
    }
  }, [point]);

  useEffect(() => {
    console.log(UnReTree.getNodes().map(e => e.getInfo()), point);
  });


  return (
    <div className="HIGH">
      <div id="keys"> 
        Ctrl + z : 되돌리기 <br/>
        Ctrl + x : 되돌리기 취소 <br/>
        Ctrl + -&gt; / &lt;- : 경로 이동
      </div>

      <textarea className="text"
      onChange={change}
      onKeyDown={keyDown}
      value = {contents}
      />
      
      <div id="ac"> All Last Case </div>
      {
        UnReTree.getLeafNodes().map((e,i) => {
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
            <div key={i}> {combine(ret)} </div>
          )
        })
      }
    </div>
  );
}

export default App;