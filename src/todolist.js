import React from 'react';
import './todolist.css'
import SubList  from './sublist';

class ToDoList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            count : 0,
            idlist : [],
            todotree : [],
        };
    }

    componentDidMount(){
        // check if there things in is localstorage
        const storedtree = localStorage.getItem('toDoList');
        if (storedtree){
            const parsedtree = JSON.parse(storedtree);
            console.log("TODOLISTMOUNT",parsedtree)
            let idlist = [];
            let count = 0;
            parsedtree.map((list) =>{
                idlist = idlist.concat([list.id]);
                count++;
            })
            this.setState({
                count: count,
                idlist: idlist,
                todotree: parsedtree,
            })
        }else{
            // if no stored tree load an example
            const example = [{"id":1636337260150,"tree":[{"id":1636337442117,"value":"Play apex","checked":true,"focus":false},{"id":1636337872537,"value":"learn Redux","checked":false,"focus":false}],"sublistTitle":"Click to edit todo list title"}]
            // const parsedtree = JSON.parse(example);
            let idlist = [];
            let count = 0;
            example.map((list) =>{
                idlist = idlist.concat([list.id]);
                count++;
            })
            this.setState({
                count: count,
                idlist: idlist,
                todotree: example,
            })
            this.storeTree(example)
        }
    }

    storeTree(todotree){
        // localStorage
        if (todotree.length === 0){
            // console.log("clear the localstorage");
            localStorage.removeItem('toDoList');
        }
        // const tree = JSON.stringify(this.state.todotree.slice());
        const tree = JSON.stringify(todotree.slice());
        localStorage.setItem('toDoList',tree);
        // const storedtree = localStorage.getItem('toDoList')
        // console.log("stored", JSON.parse(storedtree));
    }
    handleStoreSubListTitle(id,title){
        let todotree = this.state.todotree.slice();
        todotree.map((list)=>{
            if(list.id === id){
                list.sublistTitle = title
            }
        })
        this.setState({
            todotree: todotree
        })
        this.storeTree(todotree);
        console.log("subtitle",todotree,id,title)
    }
    handleStoreToDoList(id,e){
        let idlist = this.state.idlist.slice();
        let todotree = this.state.todotree.slice();
        todotree.map((list)=>{
            if(list.id === id){
                list.tree = e
            }
        })
        // console.log("storing the tree",id,e);
        // console.log("storing the tree",idlist,todotree);
        this.setState({
            todotree:  todotree
        })
        this.storeTree(todotree)
    }
    
    handleCreateToDo(){
        // use the time created as id
        const listid = Date.now();
        const idlist = this.state.idlist.slice()
        const todotree = this.state.todotree.slice()
        let newtodotree = todotree.concat([{id: listid, tree: [], sublistTitle: "To-do"}])
        this.setState({
            count: this.state.count + 1,
            idlist: idlist.concat([listid]),
            todotree: newtodotree,
        });
        console.log("clicked",listid);
        this.storeTree(newtodotree);

    }
    isIdSame(item){
        // console.log(item.id,this,item.id === this,item.id == this)
        return item.id === this;
    }

    handleDeleteToDo(id){
        const idlist = this.state.idlist.slice()
        let todotree = this.state.todotree.slice()
        let pos = idlist.indexOf(id)
        let removedid = idlist.splice(pos,1)
        pos = todotree.findIndex(this.isIdSame,id);
        removedid = todotree.splice(pos,1);
        this.setState({
            count: this.state.count - 1,
            idlist: idlist,
            todotree: todotree
        });
        console.log("deleted",id,idlist,todotree,removedid);
        this.storeTree(todotree);
    }

    render(){
        // console.log(this.state,typeof(this.state.idlist))
        // console.log("render",this.state)
        const idlist = this.state.idlist.slice()
        const nodeidlist = idlist.map((id) => {
            return(
                <SubList
                    key={id}
                    listid={id}
                    handleDeleteToDo={()=>this.handleDeleteToDo(id)}
                    handleStoreToDoList={(e)=>this.handleStoreToDoList(id,e)}
                    handleStoreSubListTitle={(e)=>this.handleStoreSubListTitle(id,e)}
                />
            )
        })

        return (
            <div className="todo-list-container">
                <h2>This is todo list</h2>
                <p>contenteditable and stored in localStorage</p>
                <div className="sublist-container">
                    <div className="todo-create-btn-container">
                        {nodeidlist}
                        <button 
                            className="create-todo-list-btn"
                            onClick={() => this.handleCreateToDo()}
                            >
                            +
                        </button>
                    </div>
                </div>
            </div>
        )    
    }
}

export default ToDoList;