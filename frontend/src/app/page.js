'use client';
import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Add Task
  const handleAddTask = () => {
    if (!formData.title) return alert('Title is required!');
    setTasks([...tasks, { id: Date.now(), ...formData }]);
    setFormData({ title: '', description: '' });
    setShowAddPopup(false);
  };

  // Edit Task
  const handleEditTask = () => {
    setTasks(tasks.map(t => (t.id === selectedTask.id ? formData : t)));
    setShowEditPopup(false);
  };

  // Delete Task
  const handleDeleteTask = () => {
    setTasks(tasks.filter(t => t.id !== selectedTask.id));
    setShowDeletePopup(false);
  };

  return (
    <div className="w-full h-screen py-24 bg-gray-100">
      <div className="mx-4 md:m-auto text-black bg-white p-6 md:w-[70%] rounded-md shadow-md space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Task Manager</h2>
          <button
            onClick={() => setShowAddPopup(true)}
            className="flex items-center bg-black text-white px-4 py-2 rounded-md cursor-pointer"
          >
            <FaPlus className="mr-2" /> Add Task
          </button>
        </div>

        {/* Task Table */}
        {tasks.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-3">#</th>
                <th className="border border-gray-300 p-3 text-left">Title</th>
                <th className="border border-gray-300 p-3 text-left">Description</th>
                <th className="border border-gray-300 p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-3">{task.title}</td>
                  <td className="border border-gray-300 p-3">{task.description}</td>
                  <td className="border border-gray-300 p-3 text-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setFormData(task);
                        setShowEditPopup(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowDeletePopup(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No tasks yet. Add one!</p>
        )}
      </div>

      {/* Add Task Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-md w-[90%] md:w-[30rem] space-y-4">
            <h2 className="text-xl font-semibold">Add New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              className="border w-full p-3 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Task Description"
              className="border w-full p-3 outline-none"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowAddPopup(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button onClick={handleAddTask} className="px-4 py-2 bg-black text-white rounded-md">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-md w-[90%] md:w-[30rem] space-y-4">
            <h2 className="text-xl font-semibold">Update Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              className="border w-full p-3 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Task Description"
              className="border w-full p-3 outline-none"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowEditPopup(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button onClick={handleEditTask} className="px-4 py-2 bg-black text-white rounded-md">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-md w-[90%] md:w-[25rem] text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="flex justify-center space-x-3">
              <button onClick={() => setShowDeletePopup(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button onClick={handleDeleteTask} className="px-4 py-2 bg-red-600 text-white rounded-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
