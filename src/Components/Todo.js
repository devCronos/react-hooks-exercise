import React, { useState, useEffect, useReducer, useRef, useMemo } from 'react';
import List from './List';
import axios from 'axios';
import {useFormInput} from '../hooks/forms';

// hooks in components! with props on the top level NOT inside a function or if/block/loop
const todo = props => {
    const [inputIsValid, setInputIsValid] = useState(false);
    // const [todoName, setTodoName] = useState('');
    // const [submittedTodo, setSubmittedTodo] = useState(null);
    // const [todoList, setTodoList] = useState([]);
    // const [todoState, setTodoState] = useState({userInput: '', todoList: []});
    const todoInputRef = useRef();
    const todoInput = useFormInput();

    const todoListReducer = (state, action) => {
        switch(action.type){
            case 'ADD': return state.concat(action.payload);
            case 'SET': return action.payload;
            case 'REMOVE': return state.filter((todo) => todo.id !== action.payload);
            default: return state;
        }
    }
    const [todoList, dispatch] = useReducer(todoListReducer, []);
    
    // outside this it would be executed in the render cycle and it hits performance and stuff so use the magic useEffect
    // runs after every render cycle, second argument empty array => it only happens once. put state items in the array and it happens on every change
    useEffect(() => {
        axios.get('https://react-hooks-experiment.firebaseio.com/todos.json').then(result =>{
            const todoData = result.data;
            const todos = [];
            for (const key in todoData){
                todos.push({id: key, name: todoData[key].name});
            }
            dispatch({type: 'SET', payload: todos});
        });
        return () => {
            console.log('cleanup');
            // cleanup before applies the function again or before componentdidUNmount
        };
    }, []);


    const mouseMoveHandler = (event) => {
        console.log(event.clientX, event.clientY);
    }
    useEffect(() => {
        // document.addEventListener('mousemove', mouseMoveHandler);
        // return () => {
        //     document.removeEventListener('mousemove', mouseMoveHandler);
        // }
    }, []);

    const inputValidationHandler = event => {
        if (event.target.value.trim() === ''){
            setInputIsValid(false);
        }else{
            setInputIsValid(true);
        }
    }

    // useEffect(() => {
    //     if (submittedTodo){
    //         dispatch({type: 'ADD', payload: submittedTodo} );
    //     }
    // }, [submittedTodo]);

    // const inputChangeHandler = event => {
        // setTodoState({
        //     userInput: event.target.value,
        //     todoList: todoState.todoList
        // });
        // setTodoName(event.target.value);
    // };

    const todoAddHandler = () => {
        // setTodoState({
        //     userInput: todoState.userInput,
        //     todoList: todoState.todoList.concat(todoState.userInput)
        // });
        // setTodoList(todoList.concat(todoName));

        // const todoName = todoInputRef.current.value;
        const todoName = todoInput.value;

        axios.post('https://react-hooks-experiment.firebaseio.com/todos.json', {name: todoName})
        .then(res => {
            setTimeout(() => {
                const todoItem = {id: res.data.name, name:todoName};
                // setTodoList(todoList.concat(todoItem));
                // setSubmittedTodo(todoItem);
                dispatch({type:'ADD', payload: todoItem})
                // console.log(res);
            }, 3000)
        }).catch(err => {
            console.log(err);
        });
    }

    const todoRemoveHandler = todoId => {
        axios.delete(`https://react-hooks-experiment.firebaseio.com/todos/${todoId}.json`).then(res=>{
            dispatch({type: 'REMOVE', payload: todoId})
        }).catch(err => console.log(err));
    }

    return <React.Fragment>
        <input 
        type="text"
        placeholder="To do" 
        // ref={todoInputRef}
        // onChange={inputValidationHandler}
        // style={{backgroundColor:inputIsValid?"transparent":"red"}}
        onChange={todoInput.onChange}
        value={todoInput.value}
        style={{backgroundColor:todoInput.validity?"transparent":"red"}}
        // onChange={inputChangeHandler} 
        // value={todoName} 
        />
        <button 
        type="button"
        onClick={todoAddHandler}>Add</button>
        {useMemo(() => <List items={todoList} onClick={todoRemoveHandler} />, [todoList])}
    </React.Fragment>
};

export default todo;