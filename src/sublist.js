import React from 'react';
import './todolist.css';
import ToDoItem from './todoitem';


class SubList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            itemsTodo: [{
                id: "create",
                value: "",
                checked: false,
                focus: false,
            }],
            itemsDone: [],
            sublistTitle: "To-do",
            renew: true,
        }
    }
    componentDidMount(){
        // check if there things in is localstorage
        const storedtree = localStorage.getItem('toDoList');
        if (storedtree){
            const parsedtree = JSON.parse(storedtree);
            parsedtree.forEach(list => {
                if(list.id === this.props.listid){
                    // console.log("did mount",list,this.props.listid)
                    this.setState({
                        itemsTodo: list.tree,
                        sublistTitle: list.sublistTitle
                    })
                }
            });
        }
    }

    handleStoreItem(id,checked,inputvalue,focus){
        // console.log("storing",id,checked,inputvalue);
        // console.log("storing itemesTodo",this.state.itemsTodo);
        const itemsTodo = this.state.itemsTodo.slice();
        itemsTodo.map((item) => {
            if(item.id === id){
                item.value = inputvalue;
                item.checked = checked;
            }
            item.focus = false;
        })
        this.props.handleStoreToDoList(itemsTodo);
    }

    handleClickLabel(e){
        // aftering clikcing label replace the label with an input
        console.log(this);
        console.log(e);
        // const todoinput = <input type="text" onChange={(e) => this.handleToDoInput(e)}></input>
        // e.target.next
        // e.target.after({todoinput})
        // console.log({todoinput})
        // e.target.remove()
    }
 
    handleToDoBlur(e,focus){
        //should handle on blur and <Enter> but haven't
        // clear the 
        // setSate after finishing the todo
        const itemsTodo = this.state.itemsTodo.slice();
        const itemid = Date.now();
        // console.log("blur focus:",e,focus)
        this.setState({
            itemsTodo: itemsTodo.concat([{
                id: itemid,
                value: e.target.outerText,
                checked: false,
                focus: focus,
            }]),
            renew: !this.state.renew,
        })
    }
    handleCreateNext(itemid){
        //handle <Enter> and create a new one with no content
        // find the current and insert next
        let itemsTodo = this.state.itemsTodo.slice();
        // console.log(itemsTodo.findIndex(this.isIdSame,itemid));
        let pos = itemsTodo.findIndex(this.isIdSame,itemid);
        const removedid = itemsTodo.splice(pos+1,0,{
            id: Date.now(),
            value: "",
            checked: false,
            focus: true,
        });
        console.log(pos,"removed",removedid);
        this.setState({
            itemsTodo: itemsTodo,
            renew: !this.state.renew,
        })
    }

    isIdSame(item){
        // console.log(item.id,this,item.id === this,item.id == this)
        return item.id === this;
    }

    handleDeleteToDoItem(id){
        const itemid = id;
        let itemsTodo = this.state.itemsTodo.slice();
        // console.log(itemsTodo.findIndex(this.isIdSame,itemid));
        let pos = itemsTodo.findIndex(this.isIdSame,itemid);
        const removedid = itemsTodo.splice(pos,1);
        console.log(pos,"removed",removedid);
        this.setState({
            itemsTodo: itemsTodo,
        })
        this.props.handleStoreToDoList(itemsTodo);
    }
    handleStoreSubListTitle(e){
        console.log(e.target.innerText);
        this.props.handleStoreSubListTitle(e.target.innerText);
    }

    render(){
        // console.log("this is id",this.props.listid,"my delete handle is",this.props.handleDeleteToDo)
        // console.log(this.state);
        let itemsTodo = this.state.itemsTodo.slice();
        // if(this.state.itemsDone===null)
            // itemsTodo =  
        let todoitems;let doneitems;
        if(itemsTodo.length === 0){
            todoitems = null
        }else{
            todoitems = itemsTodo.map((item,index) =>{
                // console.log(item);
                if(item.id === "create") return null;
                if(item.checked === true) return null;
                return(
                <ToDoItem
                    key={item.id}
                    id={item.id}
                    value={item.value}
                    handleClickLabel={(e) => this.handleClickLabel(e)}
                    handleToDoBlur={(e,f) => this.handleToDoBlur(e,f)}
                    handleDeleteToDoItem={()=>this.handleDeleteToDoItem(item.id)}
                    handleCreateNext={(e)=>this.handleCreateNext(e)}
                    handleStoreItem={(e,f)=>this.handleStoreItem(item.id,e,f)}
                    placeholder="..."
                    checkbox={true}
                    focus={item.focus}
                    checked={item.checked}
                />)
            });

            doneitems = itemsTodo.map((item,index) =>{
                // console.log(item);
                if(item.id === "create") return null;
                if(item.checked === false) return null;
                return(
                <ToDoItem
                    key={item.id}
                    id={item.id}
                    value={item.value}
                    handleClickLabel={(e) => this.handleClickLabel(e)}
                    handleToDoBlur={(e,f) => this.handleToDoBlur(e,f)}
                    handleDeleteToDoItem={()=>this.handleDeleteToDoItem(item.id)}
                    handleCreateNext={(e)=>this.handleCreateNext(e)}
                    handleStoreItem={(e,f,g)=>this.handleStoreItem(item.id,e,f,g)}
                    placeholder="..."
                    checkbox={true}
                    focus={item.focus}
                    checked={item.checked}
                />)
            });
        }
        // const todoitems = itemsTodo.map((item,index) =>{
        //     return(
        //         <ToDoItem
        //             key={item.id}
        //             value={item.value}
        //             handleClickLabel={(e) => this.handleClickLabel(e)}
        //             handleToDoBlur={(e) => this.handleToDoBlur(e)}
        //             placeholder="..."
        //             checkbox={true}
        //         />
        //     )
        // })


        return(
            <div className="sublist">
                <div className="sublist-header">
                    <span 
                        contentEditable="true"
                        spellCheck="false"
                        suppressContentEditableWarning={true}
                        onBlur={(e)=>this.handleStoreSubListTitle(e)}
                    >
                        {this.state.sublistTitle}
                    </span>
                    <button 
                        className="delete-sublist-btn"
                        onClick={this.props.handleDeleteToDo}
                    >
                        x
                    </button>
                </div>
                {todoitems}
                <ToDoItem
                    key={"add"+this.state.renew}
                    handleClickLabel={(e) => this.handleClickLabel(e)}
                    handleToDoBlur={(e,f) => this.handleToDoBlur(e,f)}
                    handleStoreItem={(e)=>this.handleStoreItem("add"+this.state.renew,e)}
                    placeholder="Add sth to the list..."
                    checkbox={false}
                    renew={this.state.renew}
                />
                <hr className="todolist-hr"/>
                {doneitems}
            </div>
        )
    }
}

export default SubList;