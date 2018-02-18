import { observable, computed, action } from 'mobx';
import EasyBool from './easyTools/EasyBool';

class GridStore {           // Just a class.  Nothing fancy here.
  constructor() { 
    console.log('here');
  }

  @observable cursor = {x:0,y:0,                    // cursor x and y values
                        maxX:-1,maxY:-1,              // max legal x and y values.
                        selectToX:-1,selectToY:-1,  // selection box for shift selection
                        editX:-1,editY:-1,          // cell being edited
                        shiftSelInProgress:false    // for shift arrow selecting cells
                       };
  @observable selectedCells = [];                 // for control clicking cells.
  @observable curEditingValue='';                 // value being edited before it is applied.

  @observable autoFocus=false;                    // if true, rendering a selected cell will cause that cell to take focus
  @observable inst = '';                          // if true, rendering a selected cell will cause that cell to take focus
  @observable pivotOn = '';                       // from props.  Here for easy cell access.

  @observable colDefList = {};



  // javascript sucks at math
  makeValidInt(inputVal, defaultVal) {
    var res = (inputVal || defaultVal);
    if (inputVal === 0) { res = inputVal; }
    if (res < 0) { res = defaultVal; }
    return Number(res);
  }

  @action logNoChangeHandlerMessage() {console.log('no change handler supplied.');}

  @action prepSelectionField(props)
  {
    var dataWide = 0;
    var dataHigh = 0;
    if (props.data && props.data.length > 0) {
      if (props.pivotOn) {  // pivot the data using this key as the col header
        //---- PIVOTED FLOW
        dataWide = props.data.length;
        dataHigh = Object.keys(props.data[0]).length;
      }
      else {
        //---- NORMAL FLOW
        dataWide = Object.keys(props.data[0]).length;
        dataHigh = props.data.length;
      }
    }
    if (this.cursor.maxX !== dataWide - 1 || this.cursor.maxY !== dataHigh - 1) {
      this.cursor.maxX = dataWide-1;
      this.cursor.maxY = dataHigh-1;
    }
    this.onChange = (props.onChange || this.logNoChangeHandlerMessage ); // easy availability to cells
    this.pivotOn = props.pivotOn;    // easy availability to cells

    if (props.columnList){
      this.colDefList = {};
      // make a map of keys to objects for easy access later.
      for(var clctr=0;clctr<props.columnList.length;clctr++){
        if (props.columnList[clctr].easyBool) {
          console.log('eb1');
          props.columnList[clctr].compCell = <EasyBool/>
        }
        this.colDefList[props.columnList[clctr].key] = props.columnList[clctr];
      }
    }
    else{
      this.colDefList = {};
    }
  }


  @action cellSelectSet(x,y,val){
    selectedCells[y][x]=val;
  }

  @action cellMoveKey(e)
  {
    // only worry about arrow keys:
      if(e.shiftKey){
        // was it already down?  if no, start a selection
        // note: google sheets does not allow 2 separate shift-cell-selections at a time.  It's one block+click collection , but not 2 blocks.
        if(!this.cursor.shiftSelInProgress){
          this.cursor.selectToX=this.cursor.x;
          this.cursor.selectToY=this.cursor.y;
          this.cursor.shiftSelInProgress=true;
        }
      }
      else{
        this.cursor.shiftSelInProgress = false;
      }
      if (e.keyCode == '38') {
        // up arrow
        this.cursor.y--;
        if (this.cursor.y < 0) this.cursor.y = 0;
      }
      else if (e.keyCode == '40') {
        // down arrow
        if (this.cursor.y < this.cursor.maxY) this.cursor.y++;
      }
      else if (e.keyCode == '37') {
        // left arrow
        this.cursor.x--;
        if (this.cursor.x < 0) this.cursor.x = 0;
      }
      else if (e.keyCode == '39') {
        // right arrow
        if (this.cursor.x < this.cursor.maxX) this.cursor.x++;
      }
      e.stopPropagation();
      e.preventDefault();    
  }

  @computed get selectionBounds(){
    var res={l:-1,r:-1,t:-1,b:-1};
    // block selection 
    if(this.cursor.shiftSelInProgress){
      res.l = Math.min(this.cursor.x, this.cursor.selectToX);
      res.r = Math.max(this.cursor.x, this.cursor.selectToX);
      res.t = Math.min(this.cursor.y, this.cursor.selectToY);
      res.b = Math.max(this.cursor.y, this.cursor.selectToY);
    }
    else{
      res.l = res.r = this.cursor.x;
      res.t = res.b = this.cursor.y;
    }
    // click selection

    return res;
  }

}

export default GridStore;


