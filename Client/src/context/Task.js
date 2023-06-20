import React, { createContext, useContext, useState } from 'react';

const TasksContext = createContext();

const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const updateTasks = (newTasks) => {
        setTasks(newTasks);
    };

    return (
        <TasksContext.Provider value={{ tasks, updateTasks }}>
            {children}
        </TasksContext.Provider>
    );
};

const useTasks = () => useContext(TasksContext);

export { TasksProvider, useTasks };