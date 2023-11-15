<template>
    <div class="task" :class="{'completed' : task.status.done}">
        <span @click="UpdateTask">
            <font-awesome-icon v-if="task.status.done" class="check-icon" icon="fa-solid fa-circle-check" /> 
            <font-awesome-icon v-if="!task.status.done" class="check-icon" :icon="['far', 'fa-circle-check']" /> 
            <span class="task-name">{{ task.name }}</span>
            <v-tooltip
                activator="parent"
                location="top"
              >toggle to mark task done/undone </v-tooltip>
        </span>
        <button v-if="on_view !== 'deleted'" class="delete-task" @click="DeleteTask"><font-awesome-icon :icon="['fas', 'trash']" />
            <v-tooltip
                activator="parent"
                location="top"
              >click to delete task</v-tooltip>
        </button>
    </div>
</template>
  
<script>
export default {
    name: 'TaskItem',
    props: [
        "task", // props data - particular task information.
        "on_view"
    ],
    data: () => ({
        // do data added so far
    }),
    methods: {
        // delete task event
        DeleteTask: function() {
            this.$emit("DeleteTask", this.task.id); //sends back the task id to parent component to initialize deletion.
        },
        // complete task event
        UpdateTask: function() {
            this.$emit("UpdateTask", this.task.id); //sends back the task id to parent component to initialize task update
            // console.log(`update task ${this.task_id}`);
        },
    }
}
</script>
  