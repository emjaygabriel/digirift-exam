<template>

    <!-- heading -->
    <h1 class="main-title">Vue ToDo List</h1>

    <!-- whole task card -->
    <div class="standard-tasks-card">
        <div class="tasks-status-bar"> <!-- top bar -->

            <!-- active task button with counter -->
            <div @click="ViewActiveTasks" class="status-text normal" :class="{'active': on_view === 'active'}">
              Tasks <span class="count">{{ active_tasks_count }}</span>

              <!-- vuetify tooltip -->
              <v-tooltip
                activator="parent"
                location="top"
              >view active tasks</v-tooltip>
            </div>

            <!-- finished task button with counter -->
            <div @click="ViewFinishedTasks" class="status-text normal" :class="{'active': on_view === 'finished'}">
              Tasks Done <span class="count">{{ finished_tasks_count }}</span>

              <!-- vuetify tooltip -->
              <v-tooltip
                activator="parent"
                location="top"
              >view finished tasks</v-tooltip>
            </div>

            <!-- deleted task button with counter -->
            <div @click="ViewDeletedTasks" class="status-text red" :class="{'active': on_view === 'deleted'}">
              <font-awesome-icon :icon="['fas', 'trash']" /> Tasks 

              <!-- vuetify tooltip -->
              <v-tooltip 
                activator="parent"
                location="top"
              >view deleted tasks</v-tooltip>
            </div>
        </div>

        <!-- list of tasks here -->
        <div v-if="task_preview.length > 0" class="tasks-list">
            <TaskItem v-for="($task, $index) in task_preview" :task="$task" :on_view="on_view" :key="$index" @DeleteTask="DeleteTask" @UpdateTask="UpdateTask"></TaskItem>
        </div>

        <!-- this will be viewed if there is no task -->
        <div v-else class="tasks-list">
            <h3>There are no tasks.</h3>
        </div>

        <!-- bottom bar which has the text entry and button to add task -->
        <div class="tasks-action-bar">
          <div class="text-entry">
            <!-- button to add task -->
            <button class="add-task" @click="AddTask"><font-awesome-icon :icon="['fas', 'circle-plus']" /> 

              <!-- vuetify tooltip -->
              <v-tooltip
                activator="parent"
                location="top"
              >click to add task</v-tooltip>
            </button>

            <!-- text entry for adding task -->
            <input type="text" class="input" @keydown.enter.prevent="AddTask" v-model="text_entry"/>

            <!-- vuetify tooltip -->
            <v-tooltip
                activator="parent"
                location="top"
              >Enter task name and press enter to add</v-tooltip>
          </div>
        </div>
    </div>
    <!-- <div class="status_message" >{{ status_message }}</div> -->

    <!-- vuetify status message -->
    <v-alert
      class="status_message"
      v-if="status_message.trim().length > 0"
      color="info"
      icon="$info"
      title="Status Message"
      :text="status_message"></v-alert>
</template>

<script>
import TaskItem from '../components/TaskItem.vue';

export default {
  name: 'ToDoList',
  components: {
    TaskItem,
  },
  data: () => ({
    text_entry: "", // variable for entering the name of the new task
    tasks: [], // array list of unfiltered tasks
    task_preview: [], // filtered array of tasks which is viewable 
    status_message: "", // message notes if there is an error (validation of empty text entry)
    on_view: "active" // serves as flag of what is being viewed in the card
  }),
  created() {

    try { // validates if there is array data in local storage - creates one if there is none.

      const local_tasks = JSON.parse(localStorage.getItem("tasks"));
      if(typeof local_tasks !== 'undefined' && local_tasks !== null) {
        this.tasks = local_tasks; 
        this.ViewActiveTasks(); // initially views the active tasks
      } else {
        localStorage.setItem("tasks", JSON.stringify([])); // creates the local storage if there is none
        this.ViewActiveTasks(); // initially views the active tasks
      }

    } catch (error) {
      this.status_message = error;
    }

  }, 
  watch: {
    tasks: {
      handler: function() { // watches tasks data changes and update the task_preview array depending on whats being viewed (active, deleted or finished)
          switch(this.on_view) {
            case "active":
              this.ViewActiveTasks(); break; // views the active tasks
            case "finished":
              this.ViewFinishedTasks(); break; // views finished tasks
            case "deleted":
              this.ViewDeletedTasks(); break; // views deleted tasks
            default:
              break;
          }

          // updates the local storage every changes happen on the tasks array 
          localStorage.setItem("tasks", JSON.stringify(this.tasks));
          this.$store.dispatch('update_all_tasks', this.tasks);
      },
      deep: true // set deep to true to checked deep changes within the array objects
    }
  },
  computed: {
    finished_tasks_count() { // computed function for counting the finished task in an array - this is automatically updated where there is changes in tasks array
      if(this.tasks.length < 1) { return 0; } // returns 0 if there are no tasks
      const $count = this.tasks.reduce((count, obj) => {
        if (obj.status.done === true && obj.status.deleted === false) {
          return count + 1;
        } else {
          return count;
        }
      },0)

      return $count;
    },

    active_tasks_count() { // computed function for counting the active task in an array - this is automatically updated where there is changes in tasks array
      if(this.tasks.length < 1) { return 0; } // returns 0 if there are no tasks
      const $count = this.tasks.reduce((count, obj) => {
        if (obj.status.done === false && obj.status.deleted === false) {
          return count + 1;
        } else {
          return count;
        }
      },0)

      return $count;
    },

    deleted_task_count() { // computed function for counting the deleted task in an array (computed function not in use)
      if(this.tasks.length < 1) { return 0; } // returns 0 if there are no tasks
      const $count = this.tasks.reduce((count, obj) => {
        if (obj.status.deleted === true) {
          return count + 1;
        } else {
          return count;
        }
      },0)

      return $count;
    }
  },
  methods: {

    AddTask: function() { // add task event
      if(this.text_entry.trim().length !== 0) { // validation for empty task entry

        const $new_task = { // new task were created in a constant variable
          id: Math.floor(Math.random() * 100000001), // just a random generation of numbers for ID
          name: this.text_entry,
          status: {
            done: false,
            deleted: false
          }
        }
        this.tasks = [...this.tasks, $new_task]; // es6 - adding the new task into the array
        this.status_message = "New task added!";
        this.text_entry = ""; // clearing the text entry after adding the new task
        this.ViewActiveTasks(); // redirects to active task;
        
      } else {
        this.status_message = "Please enter a name of your new task." // status message activated for empty task name
      }
    },

    ViewActiveTasks: function() { // view active tasks
      let $tasks = this.tasks.filter(obj => obj.status.done === false);
      $tasks = $tasks.filter(obj => obj.status.deleted === false);
      this.task_preview = $tasks;
      this.on_view = "active";
    },

    ViewFinishedTasks: function() { // view finished tasks
      let $tasks = this.tasks.filter(obj => obj.status.done === true);
      $tasks = $tasks.filter(obj => obj.status.deleted === false);
      this.task_preview = $tasks;
      this.on_view = "finished";
    },

    ViewDeletedTasks: function() { // view deleted tasks 
      this.task_preview = this.tasks.filter(obj => obj.status.deleted === true);
      this.on_view = "deleted";
    },

    DeleteTask: function($id) { // delete task function triggered from the child component
      const $task_index = this.tasks.map(e => e.id).indexOf($id); // gets the index using id
      if($task_index > -1) { //verifies if the index is existing in the task array
        this.tasks[$task_index].status.deleted = true; // updates the task to deleted
        this.status_message = "Task deleted!";
      } else {
        this.status_message = "Cannot find the task to delete. Please check with developer.";
      }
    },

    UpdateTask: function($id) { // update task function triggered from the child component
      const $task_index = this.tasks.map(e => e.id).indexOf($id); // gets the index using id
      if($task_index > -1) { //verifies if the index is existing in the task array
        this.tasks[$task_index].status.done = this.tasks[$task_index].status.done === true ? false : true; // updates done to true or false. 
        this.status_message = "Task updated!";
      } else {
        this.status_message = "Cannot find the task to update. Please check with developer.";
      }
    }
    
  }
}
</script>

<style lang="scss">
  @import '../assets/scss/todolist.scss';
</style>