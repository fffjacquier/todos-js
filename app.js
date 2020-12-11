;(function () {
  'use strict'

  const ENTER_KEY = 13
  const newTodoElt = document.getElementById('new-todo')

  let todos = []

  function showTodos() {
    todos = loadState()
    renderTodos(todos)
  }

  function addListeners() {
    newTodoElt.addEventListener('keypress', keypressHandler)
  }

  function keypressHandler(event) {
    if (event.keyCode === ENTER_KEY) {
      addTodo(event.target.value)
      newTodoElt.value = ''
    }
  }

  function addTodo(str) {
    let _todo = {
      _id: new Date().toISOString(),
      title: str,
      completed: false,
    }
    let _todos = [...todos, _todo]
    saveState(_todos)
    renderTodos(_todos)
  }

  function renderTodos(todos) {
    const ul = document.getElementById('todo-list')
    ul.innerHTML = ''
    todos.forEach((todo) => ul.appendChild(createTodoListItem(todo)))
  }

  function createTodoListItem(todo) {
    const checkbox = document.createElement('input')
    checkbox.className = 'toggle'
    checkbox.type = 'checkbox'
    checkbox.addEventListener('change', checkboxChanged.bind(this, todo))

    const label = document.createElement('label')
    label.appendChild(document.createTextNode(todo.title))
    label.addEventListener('dblclick', todoDblClicked.bind(this, todo))

    const deleteLink = document.createElement('button')
    deleteLink.className = 'destroy'
    deleteLink.addEventListener('click', deleteButtonPressed.bind(this, todo))

    const divDisplay = document.createElement('div')
    divDisplay.className = 'view'
    divDisplay.appendChild(checkbox)
    divDisplay.appendChild(label)
    divDisplay.appendChild(deleteLink)

    const inputEditTodo = document.createElement('input')
    inputEditTodo.id = 'input_' + todo._id
    inputEditTodo.className = 'edit'
    inputEditTodo.value = todo.title
    inputEditTodo.addEventListener('keypress', todoKeyPressed.bind(this, todo))
    inputEditTodo.addEventListener('blur', todoBlurred.bind(this, todo))

    const li = document.createElement('li')
    li.id = 'li_' + todo._id
    li.appendChild(divDisplay)
    li.appendChild(inputEditTodo)

    if (todo.completed) {
      li.className += 'complete'
      checkbox.checked = true
    }

    return li
  }

  function checkboxChanged(todo, event) {
    todo.completed = event.target.checked
    saveState(todos)
  }

  function todoDblClicked(todo) {
    const div = document.getElementById('li_' + todo._id)
    const inputEditTodo = document.getElementById('input_' + todo._id)
    div.className = 'editing'
    inputEditTodo.focus()
  }

  function deleteButtonPressed(todo) {
    let _todos = todos.filter((td) => td._id !== todo._id)
    saveState(_todos)
    renderTodos(_todos)
  }

  function todoKeyPressed(todo, event) {
    if (event.keyCode === ENTER_KEY) {
      const inputEditTodo = document.getElementById('input_' + todo._id)
      inputEditTodo.blur()
    }
  }

  // save new title after edit or delete
  function todoBlurred(todo, event) {
    var trimmedText = event.target.value.trim()
    if (!trimmedText) {
      // remove todo
      let _todos = todos.filter((td) => td._id !== todo._id)
      saveState(_todos)
      renderTodos(_todos)
    } else {
      todo.title = trimmedText
      // update
      saveState(todos)
    }
  }

  showTodos()
  addListeners()
})()
