# 🗺️ Minecraft Task Manager - User Guide

Welcome to the **Minecraft Task Manager**! This tool is designed to help you and your friends collaboratively plan, track, and complete complex projects in Minecraft. 

Instead of simple to-do lists, this app uses an interactive **Network Graph**. Because Minecraft tasks are deeply interconnected (e.g., you need to *Mine Iron* before you can *Make an Iron Pickaxe* or *Shear Sheep*), this graph lets you visually map out everything you need to do and see how tasks depend on one another.

Here is a quick guide on how to navigate and use the workspace.

---

## 1. Navigating the Graph

The main dashboard is an infinite canvas representing your team's collective brain.

- **Pan/Move**: Click and drag anywhere on the empty dark background to move around the canvas.
- **Zoom**: Use your mouse scroll wheel or trackpad to zoom in and out. You can also use the `+` and `-` buttons in the bottom-left corner.
- **Minimap**: Check the bottom-left corner for a minimap to see where you are in the overall project web.

---

## 2. Reading the Nodes (Tasks)

Each card on the graph is a **Node**, representing a single task or goal.

- **Progress Rings**: The left side of the task card features a small circular progress ring. A full green circle means the task is 100% complete.
- **Arrows (Dependencies)**: Straight arrows connecting the left and right sides of nodes show you the order of operations. An arrow pointing from *Task A* to *Task B* means **Task A must be done to complete Task B**.
- **Hover for Details**: Mouse over any node to see a quick popover with the task's full description and current progress.

---

## 3. Creating Tasks with the Command Bar

At the bottom center of your screen, you'll see a text input bar. This is the **Quick Add Interface**, the fastest way to build out your project network.

- **Create a Single Task**: Just type the name of the task and press `Enter`. The new task will spawn right in the center of your screen.
  - *Example*: Type `Gather Wood` ➡️ `Enter`
- **Create Linked Tasks**: You can instantly create two tasks and link them together using a text arrow (`->` or `<-`).
  - *Example*: Type `Mine Diamonds -> Make Enchantment Table` ➡️ `Enter`. This creates both nodes and draws a straight dependency arrow between them.

---

## 4. Editing Task Details (The Side Panel)

Nodes are more than just circles; they are like mini Notion pages.

- **Open the Details Panel**: Click once on any node. A side panel will slide out from the right.
- **Edit Title & Description**: Click on the title or the text box below the properties to add notes, coordinates, or instructions for your team.
- **Adjust Progress**: Use the slider in the side panel to update the completion percentage. The progress ring on the graph will update instantly!
- **Global Properties**: Use the dropdowns, text fields, and checkboxes to set properties like Status, Priority, or Assigned Area.
- **Delete Tasks**: You can delete a task by clicking the red **Delete Task** button at the bottom of the side panel, or by selecting a node (or arrow) on the canvas and pressing your `Backspace` or `Delete` key.

---

## 5. Team Collaboration & Flags

Because this is a multiplayer tool, you can let your friends know exactly what you are working on in real-time.

- **The Team Sidebar**: In the top-right corner, you'll see a list of your online team members.
- **Assigning Yourself**: Click and drag your colored avatar (flag) from the sidebar and **drop it onto a task node**.
- **Live Status**: Your flag will snap to the node. Everyone else looking at the website will instantly see your flag appear there, letting them know: *"I am currently working on this!"*

---

## 6. Graph Physics & Alignment

If your graph becomes too messy, you can use the built-in physics engine to automatically space out and align your tasks.

- **Enable Physics**: Open the **Graph Physics** panel in the top-right corner and toggle the switch. The nodes will instantly start pushing away from each other.
- **Adjust Forces**: Use the sliders to change the **Repel Force** (how hard nodes push apart) and the **Link Distance** (how long the arrows try to be).
- **Freeze Layout**: Once your tasks have settled into a clean, readable shape, toggle physics off to freeze them in place and save their locations for your team.

---

### Tips for Success
* **Break things down**: If a task feels too big (e.g., "Build Mega Base"), use the command bar to break it into smaller linked tasks (`Gather Stone -> Build Mega Base`).
* **Keep it updated**: As you play, drag your slider to update progress so your friends know what materials are still needed!
