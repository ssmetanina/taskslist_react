import { use } from "react";
import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([])

  const [openSection, setOpenSection] = useState({
    taskList: true,
    tasks: false,
    completedTasks: false,
  });

  const [sortType, setSortType] = useState('date') // priority
  const [sortOrder, setSortOrder] = useState('asc') // desc

  function toggleSections(section) {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  }

  function addTask(task) {
    setTasks([...tasks, {...task, completed: false, id: Date.now()}])
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  function completeTask(id) {
    setTasks(tasks.map((task) => (task.id === id ? {...task, completed: true} : task )))
  }

  function toggleSortOrder(type) {
    if (sortType === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else { 
    setSortType(type)
    setSortOrder('asc')
    }
  }

  function sortTasks(tasks) {
    return tasks.slice().sort((a, b) => {
      if (sortType==='priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3};
        return sortOrder === 'asc'
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
      } else {
        return sortOrder === 'asc'
        ? new Date(a.deadline) - new Date(b.deadline)
        : new Date(b.deadline) - new Date(a.deadline)
      }
    });
  }

  const activeTasks = sortTasks(tasks.filter(task => !task.completed))
  const completedTasks = tasks.filter(task => task.completed)

  return <div className="app">
    <div className="task-container">
    <h1>напиши свои дела</h1>
    <button className={`close-button ${openSection.taskList ? 'open' : ''}`} onClick={() => toggleSections('taskList')}>+</button>
    {openSection.taskList && <TaskForm addTask={addTask}/>}
    
    </div>
    <div className="task-container">
    <h2>осталось сделать:</h2>
    <button className={`close-button ${openSection.tasks ?  'open' : ''}`} onClick={() => toggleSections('tasks')}>+</button>
    
    <div className="sort-controls">
      <button className={`sort-button ${sortType === 'date' ? 'active' : ''}`} onClick={() => toggleSortOrder('date')}
      >
      по дате {sortType === 'date' && (sortOrder==='asc' ? '\u2191' : '\u2193')}
      </button>
      <button className={`sort-button ${sortType === 'priority' ? 'active' : ''}`} onClick={() => toggleSortOrder('priority')}
      >
      по важности {sortType=== 'priority' && (sortOrder==='asc' ? '\u2191' : '\u2193')}
      </button>
    </div>
    { 
      openSection.tasks && <TaskList activeTasks = {activeTasks} deleteTask = { deleteTask } completeTask={completeTask}/>
    }
    

    </div>
    <div className="completed-task-container">
    <h2 className="completed-header">сделано:</h2>
    <button className={`close-button ${openSection.completedTasks ? 'open' : ''}`} onClick={() => toggleSections('completedTasks')}>+</button>
    {
      openSection.completedTasks && <CompletedTaskList completedTasks = {completedTasks} deleteTask={deleteTask}/>
    }
    </div>

    <Footer/>
  </div>;
}

function TaskForm( {addTask} ) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('low')
  const [deadline, setDeadline] = useState('')

  function handleForm(e) {
    e.preventDefault()
    if (title.trim()) {
    addTask({ title, priority, deadline })
    }
    setTitle('')
    setPriority('low')
    setDeadline('')
  }


  return <form action="" className="task-form" onSubmit={handleForm}>
    <h3>что надо сделать?</h3>
    <input type="text" value={title} placeholder="впиши текст" required onChange={(e) => {setTitle(e.target.value)}}/>
    <h3>задача важная?</h3>
    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
    
      <option value="high">очень важная</option>
      <option value="medium">средне важная</option>
      <option value="low" >не имеет значения</option>
    </select>
    <h3>когда дедлайн?</h3>
    <input type="datetime-local" value={deadline} onChange={(e) => {
      setDeadline(e.target.value)
    }}/>
    <button type="submit">добавить</button>
  </form>
}

function TaskList( {activeTasks, deleteTask, completeTask} ) {
  return <ul className="task-list">
  {
    activeTasks.length != 0 ? 
      activeTasks.map((task) => (
      <TaskItem task = {task} key = {task.id} deleteTask = { deleteTask } completeTask={completeTask}/>
    )) : 
    <h4>ура, пусто!</h4>
    
  }
  </ul>
}

function CompletedTaskList( {completedTasks, deleteTask} ) {
  return <ul className="completed-task-list">
  {
    completedTasks.length != 0 ?
    completedTasks.map(task => (
      <TaskItem task = {task} key = {task.id} deleteTask={deleteTask} />
    )) :
    <h4>пока пусто! выполни задание из списка</h4>
  }
    
  </ul>
}

function TaskItem( {task, deleteTask, completeTask} ) {
  return <li className={`task-item ${!task.completed ? task.priority : ''}`}>
      <div className="task-info">
        <div className="task-header">
        {task.title}
        {/* : <strong>{task.priority}</strong> */}
        </div>
        <div className="task-deadline">дедлайн: {task.deadline ? task.deadline : 'не указан'}</div>
      </div>
      <div className="task-buttons">
      {
        !task.completed && 
        (<button className="complete-button" onClick={() => completeTask(task.id)}>готово</button>
      )}
        <button className="delete-button" onClick={() => deleteTask(task.id)}>удалить</button>
      </div>
  </li> 
  }


function Footer() {
  return <footer className="footer">
    <p>Использованы технологии: React, JCX, props, useState, etc.</p>
  </footer>
}

export default App;
