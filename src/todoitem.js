import React from 'react';
import './todolist.css'


class ToDoItem extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            inputvalue: "",
            copy: false,
            checked: this.props.checked,
        }

        this.inputRef = React.createRef();
        this.composition = false;
        this.handlePaste = this.handlePaste.bind(this);
    }

    handlePaste(e){
        e.preventDefault();
        // console.log(this.state)
        // actually just change the clipboard data
        // console.log((e.clipboardData || window.clipboardData).getData('text'));
        // console.log(paste,typeof(paste));
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        document.execCommand('insertText',false,paste);

        /*USING THE CLIPBOARD IS A PAIN TO HANDLE INPUT BESIDES USING document.execComand */
        // (e.clipboardData || window.clipboardData).setData("text",paste);
        // const originvalue = this.state.inputvalue;
        // console.log(paste,typeof(paste),originvalue);
        // console.log(originvalue.concat(paste));
        // console.log((e.clipboardData || window.clipboardData).getData('html'));
        // this.setState({
        //     copy: !this.state.copy
        // })
        // e.target.paste()
    }

    // prevent the component from updating every input
    // shouldComponentUpdate(nextProps, nextState){
    //     console.log("should Component Update? see:",
    //                         nextProps,
    //                         nextState,
    //                         this)
    //     const inputRef = this.inputRef.current;
    //     return nextState.inputvalue !== inputRef.outerText;//|| nextState.copy !== this.state.copy;
    // }

    // manually focus if needed
    componentDidMount(){
        //https://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
        // if want to set to the last need to set Range asnd Selection
        if(this.props.focus){
            let range = document.createRange();
            let selection = document.getSelection();
            
            // range.setStart(this.inputRef.current);
            range.selectNodeContents(this.inputRef.current);
            range.collapse(false);
            
            selection.removeAllRanges()
            selection.addRange(range);
            
            this.inputRef.current.focus();
        }
        // console.log("MOUNT TODO ITEM",this);
        if(this.props.checkbox)
            this.props.handleStoreItem(this.state.checked,this.inputRef.current.outerText);
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event
    // When typing chinese reading the <Enter> key will break the app
    handleCompositionStart(){
        this.composition = true;
    }

    handleCompositionEnd(){
        this.composition = false;
    }

    handleToDoInput(e){
        // console.log(this.state)
        // handle every time the user type (React seems to have same behavior on
        // onInput and onChange for input), ContentEditable component doesn't support
        // onChange see:https://github.com/facebook/react/issues/278
        // console.log(e.target.outerText);
        // if there is input add to the value
        this.setState({
            inputvalue: e.target.outerText
        })
        this.props.handleStoreItem(this.state.checked,e.target.outerText,true);
    }

    handleToDoKeyDown(e){
        // console.log(e)
        // if enter is pressed created new and focus on that
        // if chines is still typing (not finished by pressing <Enter> <Space>...)
        // use key for both numpadEnter and Enter
        if(!this.composition && e.key === "Enter"){
            console.log("Pressed enter!!",e)
            // catch the enter to not return
            e.preventDefault()
            if(e.target.outerText === null){
                //do nothing
            }else{
                if(this.props.checkbox){
                        this.props.handleCreateNext(this.props.id)
                    // should create a new one just below
                }else{
                    // create with focus
                    e.focus = true;
                    this.props.handleToDoBlur(e,true)
                
                }
            }
        }
    }
    handleToDoBlur(e){
        //if this is create add the value to list if not just stay calm
        // this.setState({
        //     inputvalue: "no",
        // })
        // console.log(this.state,"renew",this.props.renew)
        if(!this.props.checkbox)
            // console.log("blur",e.target.outerText,e.target.innerText,e)
            if(e.target.outerText!=="")
            // if nothing is typed ignored
            // create with no focus
            this.props.handleToDoBlur(e,false);

        // save the whole tree
        // console.log("blur",this.state.inputvalue,e.target.outerText);
        this.props.handleStoreItem(this.state.checked,e.target.outerText,false);
    }
    handleCheck(e){
        // console.log(e);
        let status = this.state.checked;
        this.setState({
            checked: !status,
        })
        // store checked
        // console.log("checked status:",!status,this.inputRef.current.outerText);
        this.props.handleStoreItem(!status,this.inputRef.current.outerText,false);
    }

    render(){

        let itemcheck;
        if(this.props.checkbox === true){
            itemcheck = <input 
            type="checkbox" 
            id="check"
            className="todo-checkbox"
            // onClick={(e)=>this.handleCheck(e)}
            onChange={(e)=>this.handleCheck(e)}
            checked={this.state.checked}
            ></input>
        } else{
            itemcheck = <div className="plus-icon todo-add">╋</div>
        }

        const deleteBtn = this.props.checkbox 
            ? <button
                onClick={this.props.handleDeleteToDoItem}
                className="todo-item-delete-btn"
              >X</button>
            : null;
        // const html = (this.state.inputvalue || this.props.value);
        
        return(
            <div className="todo-item" >
                {itemcheck}
                <div className="todo-item-label">
                    {/* <label onClick={props.handleClickLabel}>Sth to do</label> */}
                    <div 
                        type="text"
                        contentEditable="true"
                        className={ this.state.checked
                                        ? "todo-item-input todo-item-checked"
                                        : "todo-item-input"}
                        // use CSS to attend the place holder
                        placeholder={this.props.placeholder}
                        value={this.props.renew}
                        onChange={(e) => this.handleToDoInput(e)}
                        onInput={(e)=>this.handleToDoInput(e)}
                        onBlur={(e) => this.handleToDoBlur(e)}
                        onKeyDown={(e) => this.handleToDoKeyDown(e)}
                        onPaste={this.handlePaste}
                        autoComplete="off"
                        spellCheck="false"
                        wrap="soft"
                        suppressContentEditableWarning={true}
                        // autoFocus={true}
                        ref={this.inputRef}
                        onCompositionStart={() => this.handleCompositionStart()}
                        onCompositionEnd={() => this.handleCompositionEnd()}
                        // dangerouslySetInnerHTML={{__html: html}}
                        > 
                    {this.props.value}
                    </div>
                </div>
                {deleteBtn}
            </div>
        )
    }
}

export default ToDoItem;