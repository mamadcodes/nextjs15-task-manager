import { useState, useEffect } from "react";
import "../app/globals.css"
import Image from 'next/Image'

export default function Home() {
    const [tasks, setTasks] = useState([]) //Array to store Tasks
    const [newTask, setNewTask] = useState('') // Store new task title as String
    const [newDescription, setNewDescription] = useState('') //Store new Task decsription as String
    const [filter, setFilter] = useState("all") //Store the current selected filter for Filter Section
    const [activeTask, setActiveTask] = useState (null)  //Store which Task is selected bu user to perform actions like delete task or change status
    const [newTaskMenu, setNewTaskMenu] = useState(false)// Store states of new Task menu
    
    //Usefffect is a react hook that lets you synchronise a component with an external system, call everything inside on Each Render
    useEffect( () =>{
        fetchTasks()
    }, [])

    //A function to call API in order to fetch Tasks from db and make it visible on the UI
    const fetchTasks = async () =>{
        const res = await fetch('/api/tasks') // We use this method to call API with desired routes, and store API REsponse on res Variable
        const data = await res.json() // use Res as JSON Type and store it on data constant variable
        setTasks(data) // call setTask in order to store full version of tasks receviver from API, in our Array
    }

    // A fucntion to call API in order to add new Task to DB
    const addTask = async () =>{
        if(!newTask.trim()) return

        await fetch('/api/tasks', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify( {title: newTask, description: newDescription })
        });
        setNewTask('') // Clear newTask
        setNewDescription('') //Clera newDescription
        fetchTasks() // Callling fetchTasks
    }

    // A function to call API in order to change the states of Task, like done, in progress and etc.
    const toggleTask = async (id, status) =>{
        await fetch(`/api/tasks?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({ status: status })
        });
        fetchTasks()
    }

    // A function to call API in order to delete a task with desiret TASK ID
    const deleteTask = async (id) => {
        await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
        fetchTasks();
  };

    // A Function for filtering the Tasks in the UI
    const filteredTasks = tasks.filter((task) =>{
        if ( filter === 'all') return true;
        return task.status === filter
    })

    // and the UI part of this code...
    return(
        <div className="bg-slate-50">
            {/* Header Section to show profile picture and add- new task button */}
            <div className="grid grid-flow-col justify-between px-3 mb-4 pt-3">
                <div className="text-black">
                    <img src="profile.jpg" width={60} className="rounded-full"></img>
                </div>
                <button className="text-white bg-black px-6 py-3 rounded-full text-2xl" onClick={() => setNewTaskMenu(true)}> + </button>
            </div>

            {/* Section add New Task */}
            {newTaskMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-40">
                    <div className="bg-white w-3/4 max-w-md mx-auto rounded-lg p-6 text-center space-y-3 space-x-2">
                        <h1 className="text-gray-700 text-2xl">Add new Task</h1>
                        <input
                            type="text"
                            className="border p-2 w-full bg-gray-50 border-gray-600 rounded-2xl placeholder:text-gray-400 text-gray-800"
                            placeholder="Task Name"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <input
                            type="text"
                            className="border p-2 w-full bg-gray-50 border-gray-600 rounded-2xl placeholder:text-gray-400 text-gray-800"
                            placeholder="Task Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <button
                            className="bg-green-500 text-white w-1/2 mx-auto px-4 py-2 rounded-full"
                            onClick={addTask}
                            >
                            Add Task
                        </button>
                        <button
                            className="border-2 border-red-500 text-red-500 w-1/2 mx-auto px-4 py-2 rounded-full"
                            onClick={() => setNewTaskMenu(false)}
                            >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Section to show filter menu */}
            <div className="filter-section grid grid-flow-col px-3 space-x-2 pb-4">
                <button
                    className={`filter-btn px-4 py-2 text-xs text-gray-600 ${
                    filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
                    }`} onClick={() => setFilter("all")}>
                        All
                </button>
                <button
                    className={`filter-btn px-4 py-2 text-xs text-gray-600 ${
                    filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
                    }`} onClick={() => setFilter("done")}>
                        Done
                </button>
                <button
                    className={`filter-btn px-4 py-2 text-xs text-gray-600 ${
                    filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
                    }`} onClick={() => setFilter("in-progress")}>
                        In progress
                </button>
                <button
                    className={`filter-btn px-4 py-2 text-xs text-gray-600 ${
                    filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
                    }`} onClick={() => setFilter("under-review")}>
                        Under Review
                </button>

            </div>

            {/* Section to show Tasks */}
            <ul className="grid">
                {filteredTasks.map((task) => (
                    <li key={task._id} data-status = {task.status ==="done" ? "done": task.status === "under-review" ? "under-review" : "in-progress"}
                    className={`relative grid grid-flow-row items-center mb-1 rounded-3xl text-lg
                        ${task.status ==="done" ? `bg-green-500`: task.status === "under-review"? `bg-slate-400` : `bg-cyan-600`} m-2 px-4 font-light`}
                        >
                        <div className="grid grid-cols-3">
                            <div className=" col-span-2">
                                <div className="mt-4 pb-4 text-gray-100">
                                    <div className="flex-1" onClick={() => setActiveTask(task._id)}>
                                        {task.title}
                                    </div>
                                    <div className="text-xs mt-6">{task.description}</div>
                                </div>
                            </div>
                            <div className=" grid">
                                <div className="text-center text-xs text-gray-50 border-2 border-gray-50 m-auto px-3 py-1 rounded-full">
                                    {task.status === "done" ? "done" : task.status === "under-review" ? "under-review" : "In progress"}
                                </div>
                            </div>
                        </div>

                        {/* Full Screen pop up Modal for actions menu */}
                        {activeTask === task._id && (
                            <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex flex-col justify-center items-center p-4 z-20">
                                <div className="grid grid-flow-row space-y-2 text-balse">
                                    <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-full"
                                    onClick={() => {
                                        toggleTask(task._id, "done")
                                        setActiveTask(null)
                                    }}
                                    >
                                        Mark as Done
                                    </button>
                                    <button
                                    className="bg-cyan-600 text-white px-4 py-2 rounded-full"
                                    onClick={() => {
                                        toggleTask(task._id, "in-progress")
                                        setActiveTask(null)
                                    }}
                                    >
                                        Mark as In progress
                                    </button>
                                    <button
                                    className="bg-slate-400 text-white px-4 py-2 rounded-full"
                                    onClick={() => {
                                        toggleTask(task._id, "under-review")
                                        setActiveTask(null)
                                    }}
                                    >
                                        Mark as Under Review
                                    </button>
                                    <button
                                    className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-full"
                                    onClick={() => {
                                        deleteTask(task._id)
                                        setActiveTask(null)
                                    }}
                                    >
                                       Delete
                                    </button>
                                    <button
                                    className="border-2 border-gray-500 text-gray-500 px-4 py-2 rounded-full"
                                    onClick={() => {
                                        setActiveTask(null)
                                    }}
                                    >
                                       Close
                                    </button>
                                </div>
                            </div>
                        )}

                        </li>
                ))}
            </ul>

        </div>
    )
}