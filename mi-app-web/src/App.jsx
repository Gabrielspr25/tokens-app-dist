import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Bienvenido a tu nueva aplicación web', completed: false, priority: 'high' },
    { id: 2, text: 'Explora las funcionalidades', completed: false, priority: 'medium' },
    { id: 3, text: 'Personaliza según tus necesidades', completed: false, priority: 'low' }
  ])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')
  const [priority, setPriority] = useState('medium')

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: priority
      }])
      setNewTask('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757'
      case 'medium': return '#ffa502'
      case 'low': return '#2ed573'
      default: return '#747d8c'
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Mi Aplicación Web</h1>
        <p>Gestiona tus tareas de manera eficiente</p>
      </header>

      <main className="main">
        <div className="add-task-section">
          <div className="input-group">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="task-input"
            />
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            <button onClick={addTask} className="add-btn">
              Agregar
            </button>
          </div>
        </div>

        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Todas ({tasks.length})
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pendientes ({tasks.filter(t => !t.completed).length})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completadas ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        <div className="tasks-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No hay tareas {filter === 'all' ? '' : filter === 'pending' ? 'pendientes' : 'completadas'}</h3>
              <p>¡Agrega una nueva tarea para comenzar!</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <div 
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  ></div>
                  <span className="task-text">{task.text}</span>
                  <span className="priority-label">
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`toggle-btn ${task.completed ? 'completed' : ''}`}
                  >
                    {task.completed ? '✓' : '○'}
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && (
          <div className="stats">
            <div className="stat">
              <span className="stat-number">{tasks.filter(t => t.completed).length}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="stat">
              <span className="stat-number">{tasks.filter(t => !t.completed).length}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat">
              <span className="stat-number">{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</span>
              <span className="stat-label">Progreso</span>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Construido con React + Vite ⚡</p>
      </footer>
    </div>
  )
}

export default App
