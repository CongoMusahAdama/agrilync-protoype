const Task = require('../models/Task');

// Get all tasks for an agent
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ agent: req.agent.id })
                            .populate('farmer', 'name region district')
                            .populate('farm', 'name')
                            .sort({ dueDate: 1 });

    const agentRegion = req.agent.region || '';

    // Format tasks to match frontend UI expectations exactly
    const formattedTasks = tasks.map(task => ({
      id: task._id,
      type: task.type,
      title: task.title,
      farmer: task.farmer ? task.farmer.name : task.farmerName,
      farm: task.farm ? task.farm.name : task.farmName,
      location: task.location,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      synced: task.synced,
      // Use stored region → farmer's region → agent's region as fallback chain
      region: task.region || (task.farmer && task.farmer.region) || agentRegion
    }));

    res.json({
      success: true,
      data: formattedTasks
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ success: false, msg: 'Server error fetching tasks' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { type, title, farmerName, farmName, farmer, farm, location, dueDate, priority, status } = req.body;

    const newTask = new Task({
      agent: req.agent.id,
      type,
      title,
      farmerName: farmerName || 'System',
      farmName: farmName || 'N/A',
      location: location || '',
      farmer,
      farm,
      dueDate,
      priority: priority || 'normal',
      status: status || 'pending',
      synced: true,
      region: req.agent.region // Assign the agent's region to the new task
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedTask._id,
        type: savedTask.type,
        title: savedTask.title,
        farmer: savedTask.farmerName,
        farm: savedTask.farmName,
        location: savedTask.location,
        dueDate: savedTask.dueDate,
        priority: savedTask.priority,
        status: savedTask.status,
        synced: savedTask.synced,
        region: savedTask.region
      }
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ success: false, msg: 'Server error creating task' });
  }
};

// Update task status or priority
exports.updateTask = async (req, res) => {
  try {
    const { status, priority, title, dueDate, location } = req.body;
    const task = await Task.findOne({ _id: req.params.id, agent: req.agent.id });

    if (!task) {
      return res.status(404).json({ success: false, msg: 'Task not found' });
    }

    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (title) task.title = title;
    if (dueDate) task.dueDate = dueDate;
    if (location !== undefined) task.location = location;

    await task.save();

    res.json({
      success: true,
      data: {
        id: task._id,
        type: task.type,
        title: task.title,
        farmer: task.farmerName,
        farm: task.farmName,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        synced: task.synced,
        region: task.region || req.agent.region
      }
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ success: false, msg: 'Server error updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, agent: req.agent.id });

    if (!task) {
      return res.status(404).json({ success: false, msg: 'Task not found' });
    }

    res.json({
      success: true,
      msg: 'Task deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ success: false, msg: 'Server error deleting task' });
  }
};
