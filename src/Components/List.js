import React from 'react';

const list = (props) => {
    console.log("rendering");
    return (
    <ul>
        {props.items.map((todo) => (
            <li key={todo.id} onClick={props.onClick.bind(this, todo.id)}>{todo.name}</li>
        ))}
    </ul>
    )
}
export default list;