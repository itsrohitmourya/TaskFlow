import User from "../model/user.model.js";

const getTodos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todos loaded successfully",
      todos: user.todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const saveTodos = async (req, res) => {
  const { todos } = req.body;

  if (!todos) {
    return res.status(404).json({
      success: false,
      message: "No data to save",
    });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.todos = todos;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Todos save successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Todo ID required",
    });
  }

  try {
    await User.updateOne({ _id: req.user.id }, { $pull: { todos: { id } } });

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Todo ID required",
    });
  }

  try {
    const updateFields = {};

    if (name !== undefined) updateFields["todos.$.name"] = name;
    if (status !== undefined) updateFields["todos.$.status"] = status;

    const updated = await User.updateOne(
      { _id: req.user.id, "todos.id": id },
      { $set: updateFields }
    );

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
    });
  } catch (error) {
    console.error("UPDATE TODO ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export { getTodos, saveTodos, deleteTodo, updateTodo };
