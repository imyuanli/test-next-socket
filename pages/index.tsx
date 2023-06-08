import React, {useEffect, useState} from 'react';
import {io} from "socket.io-client";

const ENDPOINT = 'http://localhost:3000'; // Socket 服务器地址

export default function Index() {
    const [todoList, setTodoList] = useState([])
    var socket = io(ENDPOINT);

    useEffect(() => {
        // 监听服务器发送的待办事项列表
        socket.on('todoList', function (todoList) {
            setTodoList(todoList)
        });
        // 在组件卸载时断开 Socket 连接
        return () => {
            socket.disconnect();
        };
    }, [])

    const [value, setValue] = useState('')
    const handleClick = () => {
        socket.emit('addTodo', value);
        setValue('')
    }
    const handleDelete= (index) => {
        socket.emit('deleteTodo', index);
    }
    return (
        <div className={''}>
            <h1>TodoList</h1>
            <ul id="todo-list">
                {
                    todoList.map((item, index) => {
                        return (
                            <div className={'flex'}>
                                <li key={index}>{item}</li>
                                <button onClick={()=>{handleDelete(index)}}>x</button>
                            </div>
                        )
                    })
                }
            </ul>

            <input
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
            />
            <button
                onClick={handleClick}
            >
                添加
            </button>
        </div>
    );
}